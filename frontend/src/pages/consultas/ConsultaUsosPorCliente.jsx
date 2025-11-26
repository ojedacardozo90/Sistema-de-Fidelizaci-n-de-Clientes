// RUTA: src/pages/consultas/ConsultaUsosPorCliente.jsx
// -----------------------------------------------------------------
// Consulta de Usos por Cliente - Página 20 del PDF (idéntico Figma)
// -----------------------------------------------------------------

import { useState, useEffect } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";

export default function ConsultaUsosPorCliente() {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(endpoints.clientes).then((res) => setClientes(res.data));
  }, []);

  const buscar = () => {
    if (!clienteId) return;

    api
      .get(`/consultas/usos_por_cliente/?cliente_id=${clienteId}`)
      .then((res) => setData(res.data))
      .catch(console.error);
  };

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Usos por Cliente
      </h1>

      {/* TARJETA FILTROS */}
      <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200 mb-8">

        <div className="grid grid-cols-1 gap-6">

          {/* SELECT DE CLIENTE */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Cliente</label>

            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="border border-gray-300 px-3 py-3 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellido} — {c.numero_documento}
                </option>
              ))}
            </select>
          </div>

        </div>

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
          "Concepto",
          "Puntos",
          "Fecha",
          "Detalle FIFO",
        ]}
        rows={data.map((u) => ({
          Concepto: u.concepto.descripcion,
          Puntos: u.puntos_utilizados,
          Fecha: u.fecha?.slice(0, 10),
          "Detalle FIFO": u.detalles
            .map((d) => `Bolsa #${d.bolsa_id} — ${d.puntos_utilizados} pts`)
            .join(", "),
        }))}
      />
    </div>
  );
}
