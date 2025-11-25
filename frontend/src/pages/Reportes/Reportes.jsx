// RUTA: src/pages/reportes/Reportes.jsx
//-----------------------------------------------------------
// Módulo profesional de Reportes del Sistema de Fidelización
// Incluye todos los reportes obligatorios:
//  - Puntos a vencer
//  - Ranking de clientes
//  - Bolsas por rango
//  - Usos por cliente / fecha / concepto
//-----------------------------------------------------------

import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

import {
  Bar,
  Pie,
  Line
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Reportes() {
  // -----------------------------------------------------------
  // ESTADOS DEL MÓDULO
  // -----------------------------------------------------------
  const [puntosVencer, setPuntosVencer] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [bolsasRango, setBolsasRango] = useState([]);
  const [usosConcepto, setUsosConcepto] = useState([]);
  const [usosFecha, setUsosFecha] = useState([]);
  const [usosCliente, setUsosCliente] = useState([]);

  const [clientes, setClientes] = useState([]);
  const [conceptos, setConceptos] = useState([]);

  // Filtros
  const [dias, setDias] = useState(30);
  const [minP, setMinP] = useState(0);
  const [maxP, setMaxP] = useState(1000);
  const [seleccionCliente, setSeleccionCliente] = useState("");
  const [seleccionConcepto, setSeleccionConcepto] = useState("");
  const [fecha, setFecha] = useState("");

  // -----------------------------------------------------------
  // CARGAR DATA INICIAL
  // -----------------------------------------------------------
  useEffect(() => {
    api.get(endpoints.clientes).then(r => setClientes(r.data));
    api.get(endpoints.conceptos).then(r => setConceptos(r.data));
  }, []);

  // -----------------------------------------------------------
  // CONSULTAS
  // -----------------------------------------------------------
  const consultarPuntosVencer = () => {
    api.get(`${endpoints.puntos_a_vencer}?dias=${dias}`)
      .then(r => setPuntosVencer(r.data.bolsas))
      .catch(console.error);
  };

  const consultarRanking = () => {
    api.get(endpoints.ranking)
      .then(r => setRanking(r.data.top))
      .catch(console.error);
  };

  const consultarBolsasRango = () => {
    api.get(`${endpoints.bolsas_por_rango}?min=${minP}&max=${maxP}`)
      .then(r => setBolsasRango(r.data))
      .catch(console.error);
  };

  const consultarUsosConcepto = () => {
    api.get(`${endpoints.usos_por_concepto}?concepto_id=${seleccionConcepto}`)
      .then(r => setUsosConcepto(r.data))
      .catch(console.error);
  };

  const consultarUsosFecha = () => {
    api.get(`${endpoints.usos_por_fecha}?fecha=${fecha}`)
      .then(r => setUsosFecha(r.data))
      .catch(console.error);
  };

  const consultarUsosCliente = () => {
    api.get(`${endpoints.usos_por_cliente}?cliente_id=${seleccionCliente}`)
      .then(r => setUsosCliente(r.data))
      .catch(console.error);
  };

  // -----------------------------------------------------------
  // UI
  // -----------------------------------------------------------
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Reportes del Sistema</h1>

      {/* -------------------------------------------- */}
      {/* 1) PUNTOS A VENCER */}
      {/* -------------------------------------------- */}
      <section className="bg-white p-5 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Puntos a vencer</h2>

        <div className="flex gap-3">
          <input
            type="number"
            className="border px-3 py-2 rounded"
            value={dias}
            onChange={(e) => setDias(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 rounded"
            onClick={consultarPuntosVencer}
          >
            Consultar
          </button>
        </div>

        <table className="min-w-full bg-white shadow rounded mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3">Cliente</th>
              <th className="py-2 px-3">Puntos</th>
              <th className="py-2 px-3">Vence</th>
            </tr>
          </thead>
          <tbody>
            {puntosVencer.map((b) => (
              <tr key={b.id} className="border-b">
                <td className="py-2 px-3">
                  {b.cliente.nombre} {b.cliente.apellido}
                </td>
                <td className="py-2 px-3">{b.puntos_asignados - b.puntos_utilizados}</td>
                <td className="py-2 px-3">{b.fecha_caducidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* -------------------------------------------- */}
      {/* 2) RANKING TOP 5 */}
      {/* -------------------------------------------- */}
      <section className="bg-white p-5 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Top 5 Clientes por uso de puntos</h2>

        <button
          className="bg-blue-600 text-white px-4 rounded"
          onClick={consultarRanking}
        >
          Consultar
        </button>

        <div className="mt-6 w-1/2">
          <Bar
            data={{
              labels: ranking.map((r) => r.cliente),
              datasets: [
                {
                  label: "Puntos utilizados",
                  data: ranking.map((r) => r.puntos_utilizados),
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
              ],
            }}
          />
        </div>
      </section>

      {/* -------------------------------------------- */}
      {/* 3) BOLSAS POR RANGO */}
      {/* -------------------------------------------- */}
      <section className="bg-white p-5 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Bolsas por rango</h2>

        <div className="flex gap-3">
          <input
            type="number"
            className="border px-3 py-2 rounded"
            value={minP}
            placeholder="Mínimo"
            onChange={(e) => setMinP(e.target.value)}
          />
          <input
            type="number"
            className="border px-3 py-2 rounded"
            value={maxP}
            placeholder="Máximo"
            onChange={(e) => setMaxP(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 rounded"
            onClick={consultarBolsasRango}
          >
            Consultar
          </button>
        </div>

        <table className="min-w-full bg-white shadow rounded mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3">Cliente</th>
              <th className="py-2 px-3">Puntos Asignados</th>
              <th className="py-2 px-3">Asignación</th>
            </tr>
          </thead>
          <tbody>
            {bolsasRango.map((b) => (
              <tr key={b.id} className="border-b">
                <td className="py-2 px-3">
                  {b.cliente.nombre} {b.cliente.apellido}
                </td>
                <td className="py-2 px-3">{b.puntos_asignados}</td>
                <td className="py-2 px-3">{b.fecha_asignacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* -------------------------------------------- */}
      {/* 4) USOS POR CONCEPTO */}
      {/* -------------------------------------------- */}
      <section className="bg-white p-5 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Usos por concepto</h2>

        <div className="flex gap-3">
          <select
            className="border px-3 py-2 rounded"
            onChange={(e) => setSeleccionConcepto(e.target.value)}
          >
            <option value="">Seleccione concepto</option>
            {conceptos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.descripcion}
              </option>
            ))}
          </select>

          <button
            className="bg-blue-600 text-white px-4 rounded"
            onClick={consultarUsosConcepto}
          >
            Consultar
          </button>
        </div>

        <table className="min-w-full bg-white shadow rounded mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3">Cliente</th>
              <th className="py-2 px-3">Puntos</th>
              <th className="py-2 px-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {usosConcepto.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-2 px-3">
                  {u.cliente.nombre} {u.cliente.apellido}
                </td>
                <td className="py-2 px-3">{u.puntos_utilizados}</td>
                <td className="py-2 px-3">{u.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* -------------------------------------------- */}
      {/* 5) USOS POR FECHA */}
      {/* -------------------------------------------- */}
      <section className="bg-white p-5 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Usos por fecha</h2>

        <div className="flex gap-3">
          <input
            type="date"
            className="border px-3 py-2 rounded"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 rounded"
            onClick={consultarUsosFecha}
          >
            Consultar
          </button>
        </div>

        <table className="min-w-full bg-white shadow rounded mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3">Cliente</th>
              <th className="py-2 px-3">Puntos</th>
              <th className="py-2 px-3">Concepto</th>
            </tr>
          </thead>
          <tbody>
            {usosFecha.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-2 px-3">
                  {u.cliente.nombre} {u.cliente.apellido}
                </td>
                <td className="py-2 px-3">{u.puntos_utilizados}</td>
                <td className="py-2 px-3">{u.concepto.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* -------------------------------------------- */}
      {/* 6) USOS POR CLIENTE */}
      {/* -------------------------------------------- */}
      <section className="bg-white p-5 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Usos por cliente</h2>

        <div className="flex gap-3">
          <select
            className="border px-3 py-2 rounded"
            onChange={(e) => setSeleccionCliente(e.target.value)}
          >
            <option value="">Seleccione cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.apellido}
              </option>
            ))}
          </select>

          <button
            className="bg-blue-600 text-white px-4 rounded"
            onClick={consultarUsosCliente}
          >
            Consultar
          </button>
        </div>

        <table className="min-w-full bg-white shadow rounded mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3">Concepto</th>
              <th className="py-2 px-3">Puntos</th>
              <th className="py-2 px-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {usosCliente.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-2 px-3">{u.concepto.descripcion}</td>
                <td className="py-2 px-3">{u.puntos_utilizados}</td>
                <td className="py-2 px-3">{u.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}
