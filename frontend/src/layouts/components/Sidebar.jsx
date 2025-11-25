// RUTA: src/layouts/components/Sidebar.jsx

import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <aside className="w-64 bg-white shadow-md h-full p-6 space-y-8">

      {/* Logo */}
      <h1 className="text-xl font-bold text-[#0B4AA0]">FIDELIZACIÓN</h1>

      {/* Menú */}
      <nav className="space-y-4 text-gray-700">

        <Link to="/dashboard" className="block hover:text-blue-600">
          📊 Dashboard
        </Link>

        <Link to="/clientes" className="block hover:text-blue-600">
          👥 Clientes
        </Link>

        <Link to="/conceptos" className="block hover:text-blue-600">
          🎁 Conceptos
        </Link>

        <Link to="/reglas" className="block hover:text-blue-600">
          ⚙️ Reglas
        </Link>

        <Link to="/vencimientos" className="block hover:text-blue-600">
          ⏳ Vencimientos
        </Link>

        <Link to="/bolsas" className="block hover:text-blue-600">
          💰 Bolsa
        </Link>

        <Link to="/usos" className="block hover:text-blue-600">
          🔄 Canje
        </Link>

        <button
          onClick={logout}
          className="block text-left text-red-600 hover:text-red-800 mt-10"
        >
          🚪 Cerrar sesión
        </button>

      </nav>
    </aside>
  );
}
