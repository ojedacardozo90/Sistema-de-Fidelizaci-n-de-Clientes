// RUTA: src/pages/auth/Login.jsx
// LOGIN EXACTO AL FIGMA + JWT COMPLETAMENTE FUNCIONAL

import { useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function Login({ onLogin }) {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post(endpoints.login, {
        username,
        password,
      });

      // GUARDAR TOKEN JWT
      localStorage.setItem("token", res.data.access);

      // AVISAR A APP.JSX QUE YA ESTÁ AUTENTICADO
      onLogin();

    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen bg-[#003566] flex items-center justify-center">

      <div className="bg-white shadow-lg rounded-xl w-[380px] p-8 animate-fadeIn">

        <div className="text-center mb-6">
          <img
            src="/logo fig.png"
            alt="Logo"
            className="w-20 mx-auto mb-2"
          />
          <h1 className="text-xl font-bold text-gray-700">
            Sistema de Fidelización
          </h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label className="text-gray-600 text-sm font-semibold">
              Usuario
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 
                         focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              value={username}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm font-semibold">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 
                         focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            className="w-full bg-[#2563EB] hover:bg-[#1E3A8A] text-white 
                       font-semibold py-2 rounded-lg transition"
            type="submit"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
