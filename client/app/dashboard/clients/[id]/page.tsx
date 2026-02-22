"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "../../../../lib/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Ruler, Download, Edit, Trash2, Plus, X, Save, User, Phone, Calendar } from "lucide-react";

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

    const clone = element.cloneNode(true) as HTMLElement;
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

  const getTypeColor = (measurementType: MeasurementType) => {
    const colors = {
      shirt: "bg-blue-50 text-blue-700 border-blue-200",
      trouser: "bg-purple-50 text-purple-700 border-purple-200",
      native: "bg-amber-50 text-amber-700 border-amber-200",
      gown: "bg-pink-50 text-pink-700 border-pink-200",
      other: "bg-gray-50 text-gray-700 border-gray-200"
    };
    return colors[measurementType] || colors.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#041459] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading client data...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-xl font-semibold text-slate-800">Client not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header with Client Info and Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Decorative header bar */}
          <div className="h-2 bg-gradient-to-r from-[#041459] via-blue-600 to-purple-600"></div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Client Details */}
              <div id="client-info" className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#041459] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">{client.name}</h1>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">
                      Client Profile
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {client.phone && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                      <Phone className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">{client.phone}</span>
                    </div>
                  )}
                  {client.gender && (
                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-sm font-medium text-slate-700 capitalize">{client.gender}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
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
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#041459] text-white rounded-xl font-semibold hover:bg-[#06208f] transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 hover:-translate-y-0.5"
                >
                  {showForm ? (
                    <>
                      <X className="w-5 h-5" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Measurement
                    </>
                  )}
                </button>

                <button
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-in slide-in-from-top duration-300">
            <div className="bg-gradient-to-r from-[#041459] to-blue-600 px-8 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Ruler className="w-6 h-6" />
                {editingId ? "Edit Measurement" : "New Measurement"}
              </h3>
            </div>

            <form onSubmit={handleSaveMeasurement} className="p-8 space-y-6">
              {/* Type Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Garment Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as MeasurementType)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#041459] focus:border-[#041459] transition-all bg-white text-slate-900 font-medium"
                >
                  <option value="shirt">👔 Shirt</option>
                  <option value="trouser">👖 Trouser</option>
                  <option value="native">🥻 Native</option>
                  <option value="gown">👗 Gown</option>
                  <option value="other">✨ Other</option>
                </select>
              </div>

              {/* Measurements Grid */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Measurements (inches)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {["chest", "waist", "hip", "shoulder", "sleeve", "length", "thigh", "knee", "ankle"].map((m) => (
                    <div key={m} className="space-y-1">
                      <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                        {m}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={newMeasurements[m] ?? ""}
                        onChange={(e) =>
                          setNewMeasurements({ ...newMeasurements, [m]: Number(e.target.value) })
                        }
                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-[#041459] focus:border-[#041459] transition-all placeholder-slate-400 text-slate-900 font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Additional Notes</label>
                <textarea
                  placeholder="Add any special notes or instructions..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#041459] focus:border-[#041459] transition-all placeholder-slate-400 text-slate-900 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#041459] text-white rounded-xl font-bold text-lg hover:bg-[#06208f] transition-all shadow-lg shadow-blue-900/30 hover:shadow-xl hover:shadow-blue-900/40 hover:-translate-y-0.5"
              >
                <Save className="w-5 h-5" />
                {editingId ? "Update Measurement" : "Save Measurement"}
              </button>
            </form>
          </div>
        )}

        {/* Measurements List */}
        <div className="space-y-4">
          {measurements.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No measurements yet</h3>
             <p className="text-slate-500">
  Click &quot;Add Measurement&quot; to record {client.name}&apos;s first measurements.
</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-2">
                <Ruler className="w-5 h-5 text-slate-600" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Measurement Records ({measurements.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {measurements.map((m, index) => (
                  <div
                    key={m._id}
                    className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Card Header */}
                    <div className={`px-6 py-3 border-b-2 ${getTypeColor(m.type)} flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {m.type === "shirt" && "👔"}
                          {m.type === "trouser" && "👖"}
                          {m.type === "native" && "🥻"}
                          {m.type === "gown" && "👗"}
                          {m.type === "other" && "✨"}
                        </span>
                        <div>
                          <h3 className="font-bold capitalize text-lg">{m.type}</h3>
                          <p className="text-xs flex items-center gap-1 opacity-75">
                            <Calendar className="w-3 h-3" />
                            {new Date(m.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(m)}
                          className="p-2 hover:bg-white/50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMeasurement(m._id)}
                          className="p-2 hover:bg-white/50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      {/* Measurements Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(m.measurements).map(([key, value]) => (
                          <div key={key} className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                              {key}
                            </p>
                            <p className="text-lg font-bold text-slate-900">{value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Note */}
                      {m.note && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs font-semibold text-amber-800 mb-1 uppercase tracking-wide">
                            Note
                          </p>
                          <p className="text-sm text-amber-900">{m.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}