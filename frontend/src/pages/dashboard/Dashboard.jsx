// RUTA: src/pages/dashboard/Dashboard.jsx

import { useEffect, useState } from "react";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function Dashboard() {
  const [clientes, setClientes] = useState([]);
  const [bolsas, setBolsas] = useState([]);
  const [usos, setUsos] = useState([]);
  const [puntosVencer, setPuntosVencer] = useState([]);

  useEffect(() => {
    // CLIENTES
    api.get(endpoints.clientes).then((res) => {
      console.log("CLIENTES => ", res.data);
      setClientes(res.data?.results ?? []);
    });

    // BOLSAS
    api.get(endpoints.bolsas).then((res) => {
      console.log("BOLSAS => ", res.data);
      setBolsas(res.data?.results ?? []);
    });

    // USOS
    api.get(endpoints.usos).then((res) => {
      console.log("USOS => ", res.data);
      setUsos(res.data?.results ?? []);
    });

    // PUNTOS A VENCER (CORREGIDO)
    api
      .get(endpoints.consultas.puntos_a_vencer + "?dias=30")
      .then((res) => {
        console.log("PUNTOS_VENCER => ", res.data);
        setPuntosVencer(res.data?.bolsas ?? []);
      });

  }, []);

  // =====================================================================
  // KPIs
  // =====================================================================
  const totalClientes = clientes.length;
  const puntosAsignados = bolsas.reduce((acc, b) => acc + b.puntos_asignados, 0);
  const puntosUsados = usos.reduce((acc, u) => acc + u.puntos_utilizados, 0);
  const puntosPorVencer = puntosVencer.reduce(
    (acc, b) => acc + (b.puntos_asignados - b.puntos_utilizados),
    0
  );

  const niveles = {
    BRONCE: clientes.filter((c) => c.nivel_fidelizacion === "BRONCE").length,
    PLATA: clientes.filter((c) => c.nivel_fidelizacion === "PLATA").length,
    ORO: clientes.filter((c) => c.nivel_fidelizacion === "ORO").length,
    DIAMANTE: clientes.filter((c) => c.nivel_fidelizacion === "DIAMANTE").length,
  };

  // =====================================================================
  // Evolución Mensual
  // =====================================================================
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  const puntosAsignadosMes = Array(12).fill(0);
  const puntosUsadosMes = Array(12).fill(0);

  bolsas.forEach((b) => {
    const mes = new Date(b.fecha_asignacion).getMonth();
    puntosAsignadosMes[mes] += b.puntos_asignados;
  });

  usos.forEach((u) => {
    const mes = new Date(u.fecha).getMonth();
    puntosUsadosMes[mes] += u.puntos_utilizados;
  });

  const lineData = {
    labels: meses,
    datasets: [
      {
        label: "Puntos Asignados",
        data: puntosAsignadosMes,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.3)",
        tension: 0.3,
      },
      {
        label: "Puntos Usados",
        data: puntosUsadosMes,
        borderColor: "#16a34a",
        backgroundColor: "rgba(22, 163, 74, 0.3)",
        tension: 0.3,
      },
    ],
  };

  const doughnutData = {
    labels: ["Bronce", "Plata", "Oro", "Diamante"],
    datasets: [
      {
        data: [niveles.BRONCE, niveles.PLATA, niveles.ORO, niveles.DIAMANTE],
        backgroundColor: ["#cd7f32", "#c0c0c0", "#ffd700", "#0ea5e9"],
      },
    ],
  };

  return (
    <div className="space-y-10 p-4">
      <h1 className="text-2xl font-bold">Dashboard General</h1>

      {/* BOTONES RÁPIDOS */}
      <div className="grid grid-cols-3 gap-4">
        <Link to="/clientes/nuevo" className="bg-blue-600 text-white px-6 py-4 rounded shadow text-center font-semibold hover:bg-blue-700">➕ Crear Cliente</Link>

        <Link to="/servicios/cargar_puntos" className="bg-green-600 text-white px-6 py-4 rounded shadow text-center font-semibold hover:bg-green-700">📥 Cargar Puntos</Link>

        <Link to="/servicios/usar_puntos" className="bg-yellow-500 text-white px-6 py-4 rounded shadow text-center font-semibold hover:bg-yellow-600">🔄 Usar Puntos</Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="p-5 bg-white shadow rounded flex items-center gap-3">
          <span className="text-blue-600 text-4xl">👥</span>
          <div>
            <h2 className="text-gray-500 text-sm">Clientes</h2>
            <p className="text-2xl font-bold">{totalClientes}</p>
          </div>
        </div>

        <div className="p-5 bg-white shadow rounded flex items-center gap-3">
          <span className="text-green-600 text-4xl">📈</span>
          <div>
            <h2 className="text-gray-500 text-sm">Puntos Asignados</h2>
            <p className="text-2xl font-bold">{puntosAsignados}</p>
          </div>
        </div>

        <div className="p-5 bg-white shadow rounded flex items-center gap-3">
          <span className="text-red-600 text-4xl">🔥</span>
          <div>
            <h2 className="text-gray-500 text-sm">Puntos Usados</h2>
            <p className="text-2xl font-bold">{puntosUsados}</p>
          </div>
        </div>

        <div className="p-5 bg-white shadow rounded flex items-center gap-3">
          <span className="text-yellow-500 text-4xl">⏳</span>
          <div>
            <h2 className="text-gray-500 text-sm">Puntos a Vencer</h2>
            <p className="text-2xl font-bold">{puntosPorVencer}</p>
          </div>
        </div>
      </div>

      {/* GRÁFICO LÍNEA */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Evolución Mensual de Puntos</h2>
        <Line data={lineData} />
      </div>

      {/* GRÁFICO NIVELES */}
      <div className="bg-white p-6 rounded shadow w-1/3 mx-auto">
        <h2 className="text-lg font-bold mb-4 text-center">Distribución por Niveles</h2>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
}
