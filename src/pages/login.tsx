import React, { useState } from "react";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";
import { IUser } from "@/services/types";

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

      router.push("/dashboard");
    } catch (err: unknown) {
      let msg = "Error desconocido";

      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.message;
      }

      setError(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl text-black font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="mb-4">
          <label className="text-black block mb-1 font-semibold">User</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-black w-full border p-2 rounded"
            required
            placeholder="User"
          />
        </div>

        <div className="mb-4">
          <label className="text-black block mb-1 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black w-full border p-2 rounded"
            required
            placeholder ="Password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;