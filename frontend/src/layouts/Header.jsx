// RUTA: src/layouts/Header.jsx
// --------------------------------------------------------------
// Header superior estilo Figma
// - Fondo blanco
// - Sombra pequeña
// - Info usuario + botón logout
// --------------------------------------------------------------

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <header className="ml-64 h-16 bg-white shadow-card flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-50">
      
      {/* Título dinámico si querés */}
      <h2 className="text-lg font-semibold text-grayDark">
        Sistema de Fidelización
      </h2>

      {/* Usuario + logout */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-grayDark">Administrador</p>
          <p className="text-sm text-gray-500">admin@sistema.com</p>
        </div>

        <button
          onClick={logout}
          className="p-2 bg-danger text-white rounded-lg hover:bg-red-700 transition"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
