// RUTA: src/pages/dashboard/DashboardAnalytics.jsx
// Dashboard Analítico Avanzado — BI Style — Figma Premium

import { useEffect, useState } from "react";
import api from "../../services/api";
import { Bar, Line, Doughnut } from "react-chartjs-2";

export default function DashboardAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard_analytics/")
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  if (!data) return <p>Cargando Dashboard Avanzado...</p>;

  // LINE — Canjes últimos 6 meses
  const lineData = {
    labels: data.meses,
    datasets: [
      {
        label: "Canjes por mes",
        data: data.canjes_6_meses,
        borderColor: "#0062FF",
        tension: 0.3,
      },
    ],
  };

  // DOUGHNUT — Conceptos
  const doughnutData = {
    labels: data.top_conceptos.map((x) => x.nombre),
    datasets: [
      {
        data: data.top_conceptos.map((x) => x.cantidad),
        backgroundColor: ["#0062FF", "#20C997", "#FD7E14", "#6F42C1", "#DC3545"],
      },
    ],
  };

  return (
    <div className="page-container animate-fadeIn">
      <h1 className="page-title">Dashboard Analítico Avanzado</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="card p-6">
          <p className="text-gray-500 text-sm">Clientes Activos (90 días)</p>
          <p className="text-3xl font-bold">{data.clientes_activos}</p>
        </div>

        <div className="card p-6">
          <p className="text-gray-500 text-sm">Clientes Inactivos</p>
          <p className="text-3xl font-bold">{data.clientes_inactivos}</p>
        </div>

        <div className="card p-6">
          <p className="text-gray-500 text-sm">ROI del Programa</p>
          <p className="text-3xl font-bold">{data.roi}%</p>
        </div>

      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="card p-6">
          <h3 className="figma-card-title">Canjes últimos 6 meses</h3>
          <Line data={lineData} />
        </div>

        <div className="card p-6">
          <h3 className="figma-card-title">Conceptos más utilizados</h3>
          <Doughnut data={doughnutData} />
        </div>

      </div>

      {/* Tabla Mejores Acumuladores */}
      <div className="card mt-8">
        <h3 className="figma-card-title">Top 5 — Clientes con más puntos acumulados</h3>

        <table className="figma-table mt-3">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Total Acumulado</th>
            </tr>
          </thead>
          <tbody>
            {data.mejores_acumuladores.map((x, i) => (
              <tr key={i}>
                <td>{x.nombre} {x.apellido}</td>
                <td>{x.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
