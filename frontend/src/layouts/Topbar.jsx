// RUTA: src/layouts/Topbar.jsx
// Topbar premium — Diseño Figma Exacto — PALETA A

import { useLocation } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();

  // Función para generar título automático según la ruta
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/" || path === "/dashboard") return "Dashboard";

    if (path.startsWith("/clientes")) return "Clientes";
    if (path.startsWith("/conceptos")) return "Conceptos de Puntos";
    if (path.startsWith("/reglas")) return "Reglas de Puntos";
    if (path.startsWith("/vencimientos")) return "Vencimientos";
    if (path.startsWith("/bolsas")) return "Bolsas de Puntos";
    if (path.startsWith("/usos")) return "Usos de Puntos";

    if (path.startsWith("/servicios/cargar_puntos")) return "Cargar Puntos";
    if (path.startsWith("/servicios/usar_puntos")) return "Usar Puntos";

    if (path.startsWith("/consultas")) return "Consultas";
    if (path.startsWith("/reportes")) return "Reportes";

    return "Sistema de Fidelización";
  };

  return (
    <header className="topbar">
      {/* IZQUIERDA — TÍTULO DINÁMICO */}
      <h1 className="text-xl font-semibold text-gray-800">
        {getPageTitle()}
      </h1>

      {/* DERECHA — AVATAR */}
      <div className="flex items-center gap-4">

        {/* OPCIONAL: Ícono de notificaciones 
        <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full">
          <BellIcon className="h-5 w-5 text-gray-600" />
        </div>
        */}

        {/* AVATAR Figma */}
        <img
          src="https://ui-avatars.com/api/?name=User&background=0062ff&color=fff"
          alt="avatar"
          className="h-10 w-10 rounded-full shadow-sm border"
        />
      </div>
    </header>
  );
}
