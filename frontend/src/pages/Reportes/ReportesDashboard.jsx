/**
 * ReportesDashboard.jsx
 * -----------------------------------------------------------
 * Vista principal del módulo de reportes.
 * Accesos rápidos a:
 *  - Ranking de clientes
 *  - Puntos próximos a vencer
 *  - Filtros de usos
 *  - Bolsas por rango
 * -----------------------------------------------------------
 */

import { Link } from "react-router-dom";

export default function ReportesDashboard() {
  const cards = [
    { title: "Ranking de Clientes", path: "/reportes/ranking" },
    { title: "Puntos a Vencer", path: "/reportes/puntos_vencer" },
    { title: "Usos Filtrados", path: "/reportes/usos_filtros" },
    { title: "Bolsas por Rango", path: "/reportes/bolsas_rango" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        Reportes del Sistema
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link
            key={c.path}
            to={c.path}
            className="p-6 bg-white rounded shadow border hover:shadow-lg hover:bg-gray-50 transition"
          >
            <h3 className="text-xl font-semibold">{c.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
