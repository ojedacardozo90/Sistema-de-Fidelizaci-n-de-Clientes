import { useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ===============================
      // PETICIÓN DE LOGIN (SimpleJWT)
      // ===============================
      const res = await api.post(endpoints.login, {
        username: username,
        password: password,
      });

      // ===============================
      // SimpleJWT devuelve: { refresh, access }
      // ===============================
      const token =
        res.data?.access !== undefined && res.data?.access !== null
          ? res.data.access
          : null;

      // Validación del token
      if (token === null) {
        setError("El backend no devolvió un token válido.");
        return;
      }

      // ===============================
      // Guardar token en localStorage
      // ===============================
      localStorage.setItem("token", token);

      // Callback + recarga
      if (typeof onLogin === "function") {
        onLogin();
      }

      window.location.reload();

    } catch (err) {
      console.error("LOGIN ERROR => ", err);
      setError("Credenciales incorrectas.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0FB39A]">
      <div className="bg-white w-[420px] px-10 py-10 rounded-2xl shadow-lg">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img 
            src="/logo.png" 
            alt="logo" 
            className="w-16 h-16"
          />
        </div>

        <h2 className="text-center text-2xl font-bold mb-2 text-[#1A1A1A]">
          Bienvenido
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Inicia sesión para continuar
        </p>

        {error && (
          <p className="text-red-600 text-center text-sm mb-2">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Usuario o Email"
            className="w-full border border-[#DADADA] rounded-md px-3 py-2 text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border border-[#DADADA] rounded-md px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-2 rounded-md text-white font-semibold bg-[#0FB39A]"
          >
            Iniciar sesión
          </button>

          <p className="text-right text-xs text-[#0FB39A] cursor-pointer hover:underline">
            ¿Olvidaste tu contraseña?
          </p>

          <div className="text-center text-gray-400 text-xs">o ingresa con</div>

          <button className="w-full py-2 rounded-md font-semibold bg-white border border-gray-300">
            Google
          </button>

          <p className="text-center text-xs mt-4">
            ¿No tienes cuenta?{" "}
            <span className="text-[#0FB39A] font-semibold cursor-pointer">
              Regístrate
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}
