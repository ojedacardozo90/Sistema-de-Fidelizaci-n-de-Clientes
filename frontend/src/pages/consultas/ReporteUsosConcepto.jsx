// RUTA: src/pages/reportes/ReporteUsosConcepto.jsx
// -------------------------------------------------------------
// Reporte: Usos por Concepto — Página 25 del PDF (Diseño Figma)
// -------------------------------------------------------------

import { useState, useEffect } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";

export default function ReporteUsosConcepto() {
  const [conceptos, setConceptos] = useState([]);
  const [conceptoId, setConceptoId] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/conceptos/").then((res) => setConceptos(res.data));
  }, []);

  const buscar = () => {
    if (!conceptoId) return;

    api
      .get(`/consultas/usos_por_concepto/?concepto_id=${conceptoId}`)
      .then((res) => setData(res.data))
      .catch(console.error);
  };

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Usos por Concepto
      </h1>

      {/* TARJETA FILTROS */}
      <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200 mb-8">

        <div className="grid grid-cols-3 gap-6">

          {/* SELECT CONCEPTO */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Concepto</label>

            <select
              value={conceptoId}
              onChange={(e) => setConceptoId(e.target.value)}
              className="border border-gray-300 px-3 py-3 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccione un concepto</option>
              {conceptos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.descripcion} — {c.puntos_requeridos} pts
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
          "Cliente",
          "Puntos utilizados",
          "Fecha",
          "Detalle FIFO",
        ]}
        rows={data.map((u) => ({
          Cliente: `${u.cliente.nombre} ${u.cliente.apellido}`,
          "Puntos utilizados": u.puntos_utilizados,
          Fecha: u.fecha?.slice(0, 10),
          "Detalle FIFO": u.detalles
            .map((d) => `Bolsa #${d.bolsa_id} — ${d.puntos_utilizados} pts`)
            .join(", "),
        }))}
      />
    </div>
  );
}
