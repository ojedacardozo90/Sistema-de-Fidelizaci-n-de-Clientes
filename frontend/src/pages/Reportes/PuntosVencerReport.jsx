/**
 * PuntosVencerReport.jsx
 * -----------------------------------------------------------
 * Muestra las bolsas que vencerán en X días.
 * Consume:
 *  GET /api/consultas/puntos_a_vencer/?dias=
 * -----------------------------------------------------------
 */

import { useState } from "react";
import api from "../../services/api";
import Table from "../../components/Table";

export default function PuntosVencerReport() {
  const [dias, setDias] = useState(30);
  const [bolsas, setBolsas] = useState([]);

  const load = () => {
    api.get(`/consultas/puntos_a_vencer/?dias=${dias}`)
      .then((res) => setBolsas(res.data.bolsas))
      .catch(console.error);
  };

  const headers = ["ID", "Cliente", "Asignación", "Caducidad", "Puntos", "Estado"];

  const rows = bolsas.map((b) => ({
    id: b.id,
    cliente: `${b.cliente.nombre} ${b.cliente.apellido}`,
    asignacion: b.fecha_asignacion.slice(0, 10),
    caduca: b.fecha_caducidad.slice(0, 10),
    puntos: b.puntos_asignados,
    estado: b.estado,
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">
        Puntos Próximos a Vencer
      </h2>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          value={dias}
          onChange={(e) => setDias(e.target.value)}
          className="border p-2 rounded w-32"
        />
        <button onClick={load} className="bg-primary text-white px-4 py-2 rounded">
          Consultar
        </button>
      </div>

      <Table headers={headers} rows={rows} />
    </div>
  );
}
