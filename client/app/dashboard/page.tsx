"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { User } from "@/lib/types/user";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.get<User>("/auth/me").then(res => setUser(res.data));
  }, []);

  if (!user) return null;

  return (
    <div>
  <h2 className="text-2xl font-bold mb-2">
    Welcome back, {user.shopName} 🧵
  </h2>

  <p className="text-gray-600 mb-4">E-mail: {user.email}</p>

  <p className="text-gray-700 max-w-xl">
    MeasurePro helps you save, organize, and manage your clients’ measurements
    digitally — no more paper records or lost books. Easily access each
    client’s details anytime, update measurements, and keep your tailoring
    business running smoothly.
  </p>
</div>

  );
}
