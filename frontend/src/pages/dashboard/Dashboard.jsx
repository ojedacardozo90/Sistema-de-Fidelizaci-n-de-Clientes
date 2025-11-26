// RUTA: src/pages/dashboard/Dashboard.jsx
// Dashboard profesional — Igual al Figma / PDF

import { useEffect, useState } from "react";
import api from "../../services/api";
import { Bar, Doughnut } from "react-chartjs-2";

import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);

  // 🔥 FIX PRINCIPAL: remover la barra inicial "/"
  useEffect(() => {
    api
      .get("dashboard_metrics/")
      .then((res) => setMetrics(res.data))
      .catch((err) => console.log("Error Dashboard:", err));
  }, []);

  if (!metrics)
    return <p className="text-gray-600 p-4">Cargando dashboard...</p>;

  // ===================================================
  // 1) TARJETAS KPI (IGUAL AL FIGMA)
  // ===================================================
  const KPIs = [
    {
      title: "Clientes",
      value: metrics.total_clientes,
      color: "#0D6EFD",
    },
    {
      title: "Puntos Asignados",
      value: metrics.puntos_asignados,
      color: "#20C997",
    },
    {
      title: "Puntos Usados",
      value: metrics.puntos_utilizados,
      color: "#FD7E14",
    },
    {
      title: "Puntos Vencidos",
      value: metrics.puntos_vencidos ?? 0,
      color: "#DC3545",
    },
  ];

  // ===================================================
  // 2) GRÁFICO DE BARRAS
  // ===================================================
  const chartData = {
    labels: ["Asignados", "Usados", "Vencidos", "Por vencer"],
    datasets: [
      {
        label: "Puntos",
        data: [
          metrics.puntos_asignados,
          metrics.puntos_utilizados,
          metrics.puntos_vencidos ?? 0,
          metrics.puntos_por_vencer,
        ],
        backgroundColor: ["#0D6EFD", "#FD7E14", "#DC3545", "#20C997"],
        borderWidth: 0,
      },
    ],
  };

  // ===================================================
  // 3) DOUGHNUT — Ranking Top 5
  // ===================================================
  const topLabels = metrics.top_5.map(
    (x) => `${x.cliente__nombre} ${x.cliente__apellido}`
  );
  const topValues = metrics.top_5.map((x) => x.total);

  const doughnutData = {
    labels: topLabels,
    datasets: [
      {
        data: topValues,
        backgroundColor: [
          "#0D6EFD",
          "#20C997",
          "#FD7E14",
          "#6F42C1",
          "#DC3545",
        ],
      },
    ],
  };

  return (
    <div className="page-container space-y-8 animate-fadeIn">

      {/* TITULO */}
      <h1 className="page-title">Dashboard General</h1>

      {/* TARJETAS KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPIs.map((kpi, i) => (
          <div key={i} className="figma-card flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
              style={{ background: kpi.color }}
            >
              {kpi.value}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{kpi.title}</p>
              <p className="text-xl font-semibold">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BAR CHART */}
        <div className="figma-card">
          <h3 className="figma-card-title mb-3">Estado de Puntos</h3>
          <Bar data={chartData} />
        </div>

        {/* DOUGHNUT */}
        <div className="figma-card">
          <h3 className="figma-card-title mb-3">Top 5 Clientes</h3>
          <Doughnut data={doughnutData} />
        </div>

      </div>

      {/* TABLA RANKING */}
      <div className="figma-card">
        <h3 className="figma-card-title mb-3">Ranking Detallado</h3>

        <table className="figma-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Puntos Utilizados</th>
            </tr>
          </thead>

          <tbody>
            {metrics.top_5.map((item, i) => (
              <tr key={i}>
                <td>
                  {item.cliente__nombre} {item.cliente__apellido}
                </td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
