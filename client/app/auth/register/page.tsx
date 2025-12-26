"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validators/auth";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await api.post("/auth/register", data);
      router.push("/dashboard");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT IMAGE */}
      <div className="hidden md:flex flex-1 relative">
        <Image
          src="/tape3.jpg"
          alt="Sign up visual"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white md:bg-transparent p-6 md:p-0 rounded-lg md:rounded-none shadow-sm md:shadow-none"
        >
          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-6">
             <Image src="/tape4.jpg" alt="Login" width={90} height={90} className="object-contain rounded-full" priority />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
              Create Tailor Account
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-2 px-3">
              Register to manage your clients and measurements seamlessly
            </p>
          </div>

          {/* SHOP NAME */}
          <input
            placeholder="Shop Name"
            {...register("shopName")}
            className="w-full p-3 border-b border-gray-400 mb-4 bg-transparent focus:outline-none focus:border-[#00817c]"
          />
          {errors.shopName && (
            <p className="text-red-600 text-sm mb-2">
              {errors.shopName.message}
            </p>
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-3 border-b border-gray-400 mb-4 bg-transparent focus:outline-none focus:border-[#00817c]"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mb-2">
              {errors.email.message}
            </p>
          )}

          {/* PASSWORD */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full p-3 border-b border-gray-400 bg-transparent focus:outline-none focus:border-[#041459] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm mb-4">
              {errors.password.message}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#041459] cursor-pointer text-white py-3 rounded transition hover:bg-[#041459] mb-4 disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>

          {/* FOOTER */}
          <p className="text-center text-base text-gray-700">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#041459] font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
