import React, { useState } from "react";

type Props = {
  onLogin: () => void;
};

export default function LoginJSONBin({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const BIN_ID = "69009c59d0ea881f40c1ebc5"; // 👈 reemplazá por tu bin ID
  const API_KEY = "$2a$10$Q77xDLdi6ItV38ZtT3vfCe8TMiDF73crWvn.PdbW9c25EXV73tyuO"; // 👈 reemplazá por tu API key

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: {
          "X-Master-Key": API_KEY,
        },
      });

      if (!res.ok) throw new Error("Error al acceder a JSONBin");
      const data = await res.json();

      const users = data.record.users;
      const match = users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (match) {
        localStorage.setItem("auth", "true");
        onLogin();
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-indigo-400">Login</h2>

        <input
          type="text"
          placeholder="User"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-700 rounded text-white"
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-700 rounded text-white"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
