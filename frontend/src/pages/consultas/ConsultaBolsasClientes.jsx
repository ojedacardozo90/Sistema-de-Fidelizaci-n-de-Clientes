// RUTA: src/pages/consultas/ConsultaBolsasCliente.jsx
// ------------------------------------------------------------
// Consulta de Bolsas por Cliente - Página 13 del PDF (Figma)
// ------------------------------------------------------------

import { useState, useEffect } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";

export default function ConsultaBolsasCliente() {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(endpoints.clientes).then((res) => {
      // Si tu backend usa paginación: results
      const lista = res.data.results ?? res.data;
      setClientes(lista);
    });
  }, []);

  const buscar = () => {
    if (!clienteId) return;

    api
      .get(`${endpoints.consultas.bolsas_por_cliente}?cliente_id=${clienteId}`)
      .then((res) => setData(res.data.bolsas))
      .catch(console.error);
  };

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Consulta de Bolsas por Cliente
      </h1>

      {/* TARJETA FILTRO */}
      <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200 mb-8">

        <label className="text-sm font-medium text-gray-600 block mb-2">
          Seleccionar Cliente
        </label>

        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 w-full text-gray-800 focus:outline-primary"
        >
          <option value="">Seleccione cliente...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>

        <div className="flex justify-end mt-6">
          <button
            onClick={buscar}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primaryDark transition"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* TABLA RESULTADOS */}
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
          Saldo: b.saldo,
        }))}
      />
    </div>
  );
}
