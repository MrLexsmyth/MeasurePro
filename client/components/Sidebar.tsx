"use client";

import Link from "next/link";

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <aside
      className={`
        fixed md:static top-0 left-0 h-full w-64 bg-[#041459] text-white z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      <div className="p-6 font-bold text-xl border-b border-white/20 flex justify-between md:block">
        MeasurePro 🧵
        <button onClick={() => setOpen(false)} className="md:hidden">
          ✕
        </button>
      </div>

      <nav className="p-4 space-y-6 flex-1 flex flex-col">
        <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
        <Link href="/dashboard/clients" onClick={() => setOpen(false)}>Customers</Link>
        <Link href="/dashboard/measurements" onClick={() => setOpen(false)}>Measurements</Link>
      </nav>
    </aside>
  );
}
