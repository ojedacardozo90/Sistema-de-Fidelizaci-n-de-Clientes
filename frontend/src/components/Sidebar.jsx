// RUTA: src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/clientes", label: "Clientes" },
    { path: "/conceptos", label: "Conceptos" },
    { path: "/reglas", label: "Reglas" },
    { path: "/vencimientos", label: "Vencimientos" },
    { path: "/bolsas", label: "Bolsas de Puntos" },
    { path: "/usos", label: "Uso de Puntos" },
    { path: "/reportes", label: "Reportes" },
  ];

  return (
    <aside className="bg-gray-800 text-white w-60 min-h-screen p-4">
      <h2 className="text-lg font-bold mb-6">Fidelización</h2>

      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
