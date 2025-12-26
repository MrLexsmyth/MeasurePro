"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/api";

export default function AddClientPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/clients", { name, phone, gender });
      router.push("/dashboard/clients");
    } catch (error) {
      console.error(error);
      alert("Failed to add client. Please try again.");
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-xl shadow-sm">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">
    Add New Client
  </h2>

  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <input
      type="text"
      placeholder="Client Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#041459]"
    />

    <input
      type="tel"
      placeholder="Phone Number"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      required
      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#041459]"
    />

    <select
      value={gender}
      onChange={(e) =>
        setGender(e.target.value as "male" | "female" | "other")
      }
      className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#041459]"
    >
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>

    <button
      type="submit"
      className="bg-[#041459] text-white py-2.5 rounded-lg font-medium hover:bg-[#06208f] transition"
    >
      Add Client
    </button>
  </form>
</div>

  );
}
