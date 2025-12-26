"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api"; // adjust path

interface Client {
  _id: string;
  name: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/clients");
        setClients(res.data);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    };

    fetchClients();
  }, []);

  // Filter clients by search term
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show only first 8 clients
  const displayedClients = filteredClients.slice(0, 8);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search for a customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", flex: 1, marginRight: "8px" }}
        />
       
      </div>
      <button
  onClick={() => router.push("/dashboard/clients/add")}
  className="
    bg-[#041459] text-white px-5 py-2.5 rounded-lg cursor-pointer font-medium shadow-sm hover:bg-[#06208f] active:scale-95 transition duration-200
  "
>
  Add New Customer
</button>


      {displayedClients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <ul>
          {displayedClients.map((client) => (
            <li
              key={client._id}
              style={{ cursor: "pointer", margin: "8px 0" }}
              onClick={() => router.push(`/dashboard/clients/${client._id}`)}
            >
              {client.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
