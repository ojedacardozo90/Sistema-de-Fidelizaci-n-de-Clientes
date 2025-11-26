// RUTA: src/pages/consultas/ConsultaUsosConcepto.jsx
// =======================================================
// Consulta: Usos de puntos por Concepto
// =======================================================

import { useEffect, useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ConsultaUsosConcepto() {
  const [conceptos, setConceptos] = useState([]);
  const [conceptoId, setConceptoId] = useState("");
  const [data, setData] = useState([]);

  // cargar conceptos
  useEffect(() => {
    api.get("/api/conceptos/")
      .then((res) => setConceptos(res.data.results || res.data))
      .catch(() => toast.error("No se pudieron cargar los conceptos."));
  }, []);

  // ejecutar consulta
  const buscar = () => {
    if (!conceptoId) {
      toast.error("Seleccione un concepto");
      return;
    }

    api
      .get("/api/consultas/usos_por_concepto/", {
        params: { concepto_id: conceptoId },
      })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Error en la consulta."));
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Usos por Concepto</h1>

      {/* === FORM === */}
      <div className="card-form mb-6">
        <label className="figma-label">Concepto</label>

        <select
          className="figma-select mb-4"
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

        <button className="figma-btn-primary w-full" onClick={buscar}>
          Consultar
        </button>
      </div>

      {/* === TABLA === */}
      <FigmaTable
        columns={[
          "Cliente",
          "Concepto",
          "Puntos Utilizados",
          "Fecha",
        ]}
        data={data.map((u) => [
          `${u.cliente?.nombre} ${u.cliente?.apellido}`,
          u.concepto?.descripcion,
          `${u.puntos_utilizados} pts`,
          u.fecha.substring(0, 10),
        ])}
      />
    </div>
  );
}
