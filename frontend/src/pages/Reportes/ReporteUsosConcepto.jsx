// RUTA: src/pages/reportes/ReporteUsosConcepto.jsx
// =======================================================
// REPORTE: Usos por Concepto (Versión Figma)
// =======================================================

import { useEffect, useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ReporteUsosConcepto() {
  const [conceptos, setConceptos] = useState([]);
  const [conceptoId, setConceptoId] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/api/conceptos/")
      .then((res) => setConceptos(res.data.results || res.data))
      .catch(() => toast.error("No se pudieron cargar los conceptos."));
  }, []);

  const buscar = () => {
    if (!conceptoId) {
      toast.error("Seleccione un concepto.");
      return;
    }

    api
      .get("/api/consultas/usos_concepto/", {
        params: { concepto_id: conceptoId },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch(() => toast.error("Error al obtener usos."));
  };

  const totalUsado = data.reduce((acc, u) => acc + u.puntos_utilizados, 0);

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Reporte — Usos por Concepto</h1>

      {/* FORMULARIO */}
      <div className="card-form mb-8">
        <label className="figma-label mb-1">Concepto</label>
        <select
          className="figma-select"
          value={conceptoId}
          onChange={(e) => setConceptoId(e.target.value)}
        >
          <option value="">Seleccione...</option>
          {conceptos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.descripcion} — {c.puntos_requeridos} pts
            </option>
          ))}
        </select>

        <button className="figma-btn-primary w-full mt-3" onClick={buscar}>
          Generar Reporte
        </button>
      </div>

      {/* TARJETA RESUMEN */}
      <div className="card p-5 mb-8 flex items-center justify-between">
        <div>
          <h2 className="card-title">Total Puntos Utilizados</h2>
          <p className="text-3xl font-bold text-blue-600">
            {totalUsado.toLocaleString()} pts
          </p>
        </div>

        <div className="text-gray-500">
          {data.length} registros encontrados
        </div>
      </div>

      {/* TABLA RESULTADOS */}
      <FigmaTable
        columns={[
          "Cliente",
          "Concepto",
          "Puntos utilizados",
          "Fecha",
          "Detalle (FIFO)",
        ]}
        data={data.map((u) => [
          `${u.cliente.nombre} ${u.cliente.apellido}`,
          `${u.concepto.descripcion}`,
          `${u.puntos_utilizados} pts`,
          u.fecha.substring(0, 10),
          `${u.detalles.length} bolsas`, // Detalles FIFO
        ])}
      />
    </div>
  );
}
