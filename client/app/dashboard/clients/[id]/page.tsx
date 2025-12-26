"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "../../../../lib/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ================= TYPES ================= */

type MeasurementType = "shirt" | "trouser" | "native" | "gown" | "other";

interface Measurement {
  _id: string;
  type: MeasurementType;
  measurements: Record<string, number>;
  note?: string;
  createdAt: string;
}

interface Client {
  _id: string;
  name: string;
  phone?: string;
  gender?: string;
}

/* ================= PAGE ================= */

export default function ClientProfilePage() {
  const params = useParams<{ id: string }>();

  const [client, setClient] = useState<Client | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<MeasurementType>("shirt");
  const [newMeasurements, setNewMeasurements] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");

  const LOCAL_STORAGE_KEY = `client-${params.id}-measurements`;

  const saveToLocal = useCallback((data: Measurement[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [LOCAL_STORAGE_KEY]);

  const loadFromLocal = useCallback((): Measurement[] => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }, [LOCAL_STORAGE_KEY]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const clientRes = await api.get(`/clients/${params.id}`);
        setClient(clientRes.data);

        try {
          const measurementsRes = await api.get(`/measurements/client/${params.id}`);
          setMeasurements(measurementsRes.data);
          saveToLocal(measurementsRes.data);
        } catch {
          const localData = loadFromLocal();
          setMeasurements(localData);
        }
      } catch (error) {
        console.error("Failed to fetch client data:", error);
        const localData = loadFromLocal();
        setMeasurements(localData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, loadFromLocal, saveToLocal]);

  const handleSaveMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(newMeasurements).length === 0) {
      alert("Please enter at least one measurement");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/measurements/${editingId}`, { type, measurements: newMeasurements, note });
      } else {
        await api.post(`/measurements`, { clientId: params.id, type, measurements: newMeasurements, note });
      }
      const res = await api.get(`/measurements/client/${params.id}`);
      setMeasurements(res.data);
      saveToLocal(res.data);

      setShowForm(false);
      setEditingId(null);
      setNewMeasurements({});
      setNote("");
      setType("shirt");
    } catch (error) {
      console.error(error);
      alert("Failed to save measurement. Please try again.");
    }
  };

  const handleDeleteMeasurement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this measurement?")) return;
    try {
      await api.delete(`/measurements/${id}`);
      const updated = measurements.filter((m) => m._id !== id);
      setMeasurements(updated);
      saveToLocal(updated);
    } catch (error) {
      console.error(error);
      alert("Failed to delete measurement. Please try again.");
    }
  };

  const handleEdit = (m: Measurement) => {
    setEditingId(m._id);
    setType(m.type);
    setNewMeasurements(m.measurements);
    setNote(m.note || "");
    setShowForm(true);
  };

const handleExportPDF = async () => {
  const element = document.getElementById("client-info");
  if (!element) return;

  // Clone element so original layout isn’t affected
  const clone = element.cloneNode(true) as HTMLElement;

  // Force all backgrounds and text colors to safe hex values
  clone.querySelectorAll("*").forEach((el) => {
    const htmlEl = el as HTMLElement;
    const style = getComputedStyle(htmlEl);
    htmlEl.style.backgroundColor = style.backgroundColor || "#ffffff";
    htmlEl.style.color = style.color || "#000000";
  });

  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, { backgroundColor: "#fff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${client?.name}-measurements.pdf`);
  } catch (err) {
    console.error("Failed to export PDF:", err);
    alert("Failed to export PDF. See console.");
  } finally {
    document.body.removeChild(clone);
  }
};


  if (loading) return <p>Loading client data...</p>;
  if (!client) return <p>Client not found</p>;

  return (
    <div className="p-6 space-y-6">
      {/* CLIENT INFO */}
      <div id="client-info" className="bg-white p-6 rounded-xl shadow-sm space-y-2">
        <h2 className="text-xl font-bold"><strong>Name : </strong>{client.name}</h2>
        <p><strong>Phone:</strong> {client.phone || "N/A"}</p>
        <p><strong>Gender:</strong> {client.gender ? client.gender.charAt(0).toUpperCase() + client.gender.slice(1) : "N/A"}</p>

        {/* MEASUREMENTS */}
        {measurements.map((m) => (
          <div key={m._id} className="border border-gray-200 p-4 rounded-lg space-y-1">
            <p><strong>Type:</strong> {m.type}</p>
            <p><strong>Date:</strong> {new Date(m.createdAt).toLocaleDateString()}</p>
            {Object.entries(m.measurements).map(([k, v]) => (
              <p key={k}><strong>{k}:</strong> {v}</p>
            ))}
            {m.note && <p><strong>Note:</strong> {m.note}</p>}
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(m)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Edit</button>
              <button onClick={() => handleDeleteMeasurement(m._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* TOGGLE FORM */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          if (!showForm) {
            setEditingId(null);
            setNewMeasurements({});
            setNote("");
            setType("shirt");
          }
        }}
        className="px-4 py-2 bg-[#041459] text-white rounded-lg hover:bg-[#06208f] transition"
      >
        {showForm ? "Cancel" : "Add Measurement"}
      </button>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <form onSubmit={handleSaveMeasurement} className="bg-white p-6 rounded-xl shadow-sm space-y-4 max-w-md">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MeasurementType)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#041459] focus:outline-none"
          >
            <option value="shirt">Shirt</option>
            <option value="trouser">Trouser</option>
            <option value="native">Native</option>
            <option value="gown">Gown</option>
            <option value="other">Other</option>
          </select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["chest","waist","hip","shoulder","sleeve","length","thigh","knee","ankle"].map((m) => (
              <div key={m} className="flex flex-col">
                <label className="font-semibold text-gray-700">{m.charAt(0).toUpperCase() + m.slice(1)}</label>
                <input
                  type="number"
                  placeholder={`Enter ${m}`}
                  value={newMeasurements[m] ?? ""}
                  onChange={(e) =>
                    setNewMeasurements({ ...newMeasurements, [m]: Number(e.target.value) })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-400 focus:ring-2 focus:ring-[#041459] focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Note</label>
            <textarea
              placeholder="Enter any note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-400 focus:ring-2 focus:ring-[#041459] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#041459] text-white rounded-lg hover:bg-[#06208f] transition"
          >
            {editingId ? "Update Measurement" : "Save Measurement"}
          </button>
        </form>
      )}

      <button
        onClick={handleExportPDF}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ml-6"
      >
        Export PDF
      </button>
    </div>
  );
}
