import { Link } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/clientes", label: "Clientes" },
    { path: "/conceptos", label: "Conceptos" },
    { path: "/reglas", label: "Reglas" },
    { path: "/bolsa", label: "Bolsas" },
    { path: "/usos", label: "Usos de Puntos" },
    { path: "/reportes", label: "Reportes" },
  ];

  return (
    <aside className="bg-gray-800 text-white w-52 min-h-screen p-4">
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link to={link.path} className="block py-2 px-3 rounded hover:bg-gray-700">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
