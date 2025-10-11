import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { IUser } from "@/services/types";
import { showSuccess, showError } from "@/utils/toast";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post<{ ok: boolean; data: IUser; message?: string }>("/api/login", {
        username,
        password,
      });

      const user = res.data.data;

      // Guardar sesión en localStorage
      localStorage.setItem("sessionUser", JSON.stringify(user));

  showSuccess("Login successful!");
  router.push("/dashboard");
    } catch (err: unknown) {
  let msg = "Unknown error";

      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.message;
      }

  setError(msg);
  showError(msg);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-8"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="max-w-md w-full bg-[#F5F2EA]/95 backdrop-blur-sm rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[#5C4033] tracking-tight">
          ABookalypse
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          <div>
            <label className="text-[#5C4033] block mb-1 font-semibold">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-[#D3C3A3] p-2 rounded text-[#5C4033] placeholder-[#A67C52] focus:ring-[#8B5E3C]"
              required
              placeholder="User"
            />
          </div>
          <div>
            <label className="text-[#5C4033] block mb-1 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#D3C3A3] p-2 rounded text-[#5C4033] placeholder-[#A67C52] focus:ring-[#8B5E3C]"
              required
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#8B5E3C] text-white py-2 rounded-md shadow-md hover:bg-[#A67C52] transition font-semibold"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;