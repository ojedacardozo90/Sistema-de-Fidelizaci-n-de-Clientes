// RUTA: src/pages/reportes/ReporteBolsasCliente.jsx
// -------------------------------------------------------------
// Reporte: Bolsas por Cliente — Página 27 del PDF (Diseño Figma)
// -------------------------------------------------------------

import { useEffect, useState } from "react";
import api from "../../services/api";
import FigmaTable from "../../components/base/FigmaTable";
import { endpoints } from "../../services/endpoints";

export default function ReporteBolsasCliente() {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(endpoints.clientes)
      .then((res) => setClientes(res.data))
      .catch(console.error);
  }, []);

  const buscar = () => {
    if (!clienteId) return;

    api
      .get(`/consultas/bolsas_por_cliente/?cliente_id=${clienteId}`)
      .then((res) => setData(res.data))
      .catch(console.error);
  };

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Bolsas por Cliente
      </h1>

      {/* TARJETA FILTROS */}
      <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200 mb-8">

        <div className="grid grid-cols-1 gap-6">

          {/* SELECT CLIENTE */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Cliente</label>

            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="border border-gray-300 px-4 py-3 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccione…</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellido} — {c.numero_documento}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* BOTÓN */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={buscar}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primaryDark transition"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <FigmaTable
        headers={[
          "ID",
          "Asignación",
          "Caducidad",
          "Asignados",
          "Usados",
          "Saldo",
        ]}
        rows={data.map((b) => ({
          ID: b.id,
          Asignación: b.fecha_asignacion?.slice(0, 10),
          Caducidad: b.fecha_caducidad?.slice(0, 10),
          Asignados: b.puntos_asignados,
          Usados: b.puntos_utilizados,
          Saldo: b.puntos_asignados - b.puntos_utilizados,
        }))}
      />
    </div>
  );
}
