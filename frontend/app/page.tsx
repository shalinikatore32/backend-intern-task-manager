"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ---------- REGISTER ----------
      if (mode === "register") {
        await apiRequest(`${baseUrl}/auth/register`, "POST", {
          email,
          full_name: fullName,
          password,
        });

        toast.success("Registration successful! Please login.");
        setMode("login");
        return;
      }

      // ---------- LOGIN ----------
      const formBody = new URLSearchParams();
      formBody.append("username", email);
      formBody.append("password", password);

      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("token", data.access_token);

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-gradient-to-br from-slate-100 to-slate-200">
      {/* App Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">
          Task Manager
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your work efficiently & securely
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          {mode === "login" ? "Login" : "Register"}
        </h1>

        <div className="flex justify-center mb-4 gap-2">
          <button
            className={`px-4 py-1 rounded-lg transition ${
              mode === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-1 rounded-lg transition ${
              mode === "register"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full border rounded px-2 py-2 bg-gray-50 focus:ring focus:ring-blue-300 outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                className="w-full border rounded px-2 py-2 bg-gray-50 focus:ring focus:ring-blue-300 outline-none"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              className="w-full border rounded px-2 py-2 bg-gray-50 focus:ring focus:ring-blue-300 outline-none"
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 mt-2 transition"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>

      <p className="mt-4 text-gray-400 text-sm">
        © 2025 Task Manager — All Rights Reserved
      </p>
    </div>
  );
}
