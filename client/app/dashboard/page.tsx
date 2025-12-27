"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { User } from "@/lib/types/user";
import { motion } from "framer-motion";


export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.get<User>("/auth/me").then(res => setUser(res.data));
  }, []);

  if (!user) return null;

  return (
    <div>
 <motion.h2
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="text-2xl font-bold mb-2"
>
  Welcome, {user.shopName} 🧵
</motion.h2>


  <p className="text-gray-600 mb-4">E-mail: {user.email}</p>
    <Image src="/tape.jpg" alt="Login" width={550} height={400} className="object-contain " priority />

 <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-gray-700 max-w-xl mt-6 leading-relaxed"
    >
      MeasurePro helps you keep your customers’ measurements safe on your phone
      or computer. No more writing on paper or losing measurement books. You can
      save each customer’s details, check their measurements anytime, and update
      them easily. This helps you work faster, avoid mistakes, and run your
      tailoring business in a more organized and professional way.
    </motion.p>


</div>

  );
}
