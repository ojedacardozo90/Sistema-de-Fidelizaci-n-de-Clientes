/**
 * BolsasRangoReport.jsx
 * -----------------------------------------------------------
 * Devuelve bolsas filtradas según rango de puntos:
 *  GET /consultas/bolsas_por_rango/?min=&max=
 * -----------------------------------------------------------
 */

import { useState } from "react";
import api from "../../services/api";
import Table from "../../components/Table";

export default function BolsasRangoReport() {
  const [minimo, setMinimo] = useState(0);
  const [maximo, setMaximo] = useState(500);
  const [bolsas, setBolsas] = useState([]);

  const consultar = () => {
    api
      .get(`/consultas/bolsas_por_rango/?min=${minimo}&max=${maximo}`)
      .then((res) => setBolsas(res.data))
      .catch(console.error);
  };

  const headers = ["ID", "Cliente", "Asignados", "Usados", "Saldo"];

  const rows = bolsas.map((b) => ({
    id: b.id,
    cliente: `${b.cliente.nombre} ${b.cliente.apellido}`,
    asignados: b.puntos_asignados,
    usados: b.puntos_utilizados,
    saldo: b.puntos_asignados - b.puntos_utilizados,
  }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Bolsas por Rango</h2>

      <div className="flex gap-3">
        <input
          type="number"
          className="border p-2 rounded"
          value={minimo}
          onChange={(e) => setMinimo(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 rounded"
          value={maximo}
          onChange={(e) => setMaximo(e.target.value)}
        />

        <button
          onClick={consultar}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      <Table headers={headers} rows={rows} />
    </div>
  );
}
