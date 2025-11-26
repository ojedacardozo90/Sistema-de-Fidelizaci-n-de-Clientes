// RUTA: src/pages/reportes/ReportesDashboard.jsx
// ============================================================
// DASHBOARD DE REPORTES (Versión Figma)
// ============================================================

import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import { FiUsers, FiGift, FiArchive, FiTrendingUp } from "react-icons/fi";

export default function ReportesDashboard() {
  const [ranking, setRanking] = useState([]);
  const [vencer, setVencer] = useState([]);
  const [conceptos, setConceptos] = useState([]);

  useEffect(() => {
    api.get("/api/consultas/ranking/").then((res) => setRanking(res.data));

    api
      .get("/api/consultas/puntos_a_vencer/")
      .then((res) => setVencer(res.data.slice(0, 5)));

    api
      .get("/api/consultas/usos_por_concepto_totales/")
      .then((res) => setConceptos(res.data));
  }, []);

  const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

  return (
    <div className="animate-fadeIn pb-10">
      <h1 className="page-title mb-8">Dashboard de Reportes</h1>

      {/* TARJETAS KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <DashboardCard
          title="Top Clientes"
          value={ranking.length}
          icon={<FiUsers size={28} />}
        />
        <DashboardCard
          title="Puntos por Vencer"
          value={vencer.length}
          icon={<FiArchive size={28} />}
        />
        <DashboardCard
          title="Conceptos de Uso"
          value={conceptos.length}
          icon={<FiGift size={28} />}
        />
        <DashboardCard
          title="Tendencias"
          value="Activo"
          icon={<FiTrendingUp size={28} />}
        />
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Ranking Clientes */}
        <div className="card p-6">
          <h2 className="card-title mb-4">Ranking: Clientes con Más Puntos Usados</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ranking}>
              <Bar dataKey="puntos_utilizados" radius={[6, 6, 0, 0]}>
                {ranking.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
              <Tooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Usos por Concepto */}
        <div className="card p-6">
          <h2 className="card-title mb-4">Usos por Concepto</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={conceptos}
                dataKey="total"
                nameKey="concepto"
                cx="50%"
                cy="50%"
                outerRadius={95}
                label
              >
                {conceptos.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTE TARJETA FIGMA */
function DashboardCard({ title, value, icon }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className="p-4 bg-blue-100 rounded-xl text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
