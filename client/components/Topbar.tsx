"use client";

import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function Topbar({
  setOpen,
}: {
  setOpen: (v: boolean) => void;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await api.post("/auth/logout");
    router.push("/auth/login");
  };

  return (
    <header className="h-16 bg-white flex items-center justify-between px-4 md:px-6 border-b">
      <div className="flex items-center gap-3">
        {/* MOBILE MENU */}
        <button onClick={() => setOpen(true)} className="md:hidden text-xl">
          ☰
        </button>
        <h1 className="font-semibold text-gray-700">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <button>🔔</button>
        <button onClick={handleLogout} className="text-red-600 text-sm">
          Logout
        </button>
      </div>
    </header>
  );
}
