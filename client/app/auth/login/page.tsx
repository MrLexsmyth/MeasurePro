"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";




export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await api.post("/auth/login", data);
      router.push("/dashboard");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2"
    style={{ fontFamily: "Playfair Display, serif" }}>
      {/* LEFT IMAGE */}
      <div className="relative hidden md:block">
        <Image
          src="/tape2.jpg"
          alt="Tailoring tools"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 flex items-end p-10">
         
        </div>
      </div>

      {/* RIGHT FORM */}

       
      
      <div className="flex-1 flex justify-center items-center md:p-6 bg-gradient-to-b from-gray-50 to-white">
          {/* FORM */}
          
          <form onSubmit={handleSubmit(onSubmit)} 
           className="w-full max-w-md md:px-2 bg-white md:bg-transparent shadow-sm md:shadow-none rounded-lg md:rounded-none p-6 md:p-0">
             <div className="flex flex-col justify-center items-center mb-6">
            <Image src="/tape.jpg" alt="Login" width={90} height={90} className="object-contain rounded-full" priority />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4 mb-4">Welcome Back!</h2>
            <p className="text-gray-600 text-sm md:text-base text-center mt-2 px-3">
               Login to manage your clients & measurements.
            </p>
          </div>
            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                {...register("email")}
                className="w-full p-3 border-b border-gray-400 mb-4 focus:outline-none focus:border-[#041459]"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                 className="w-full p-3 border-b border-gray-400 focus:outline-none focus:border-[#041459] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {errors.password && (
                <p className="mt-1 mb-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              disabled={isSubmitting}
              className="w-full bg-[#041459] mt-5 text-white py-3 rounded cursor-pointer transition hover:bg-[#041459] mb-4"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          <h2 className="text-center text-base text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[#041459] font-medium hover:underline"
            >
              Register
            </Link>
          </h2>

          </form>
       
        </div>
    
    </div>
  );
}
