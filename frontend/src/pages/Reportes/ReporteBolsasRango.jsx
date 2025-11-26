// RUTA: src/pages/reportes/ReporteBolsasRango.jsx
// =======================================================
// REPORTE: Bolsas de Puntos por Rango (Versión Figma)
// =======================================================

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ReporteBolsasRango() {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [data, setData] = useState([]);

  const buscar = () => {
    if (!min || !max) {
      toast.error("Debe ingresar un rango completo.");
      return;
    }

    api
      .get("/api/consultas/bolsas_rango/", {
        params: { min, max },
      })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Ocurrió un error en la consulta."));
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Reporte — Bolsas por Rango</h1>

      {/* FORMULARIO */}
      <div className="card-form mb-8">
        <FigmaInput
          label="Mínimo"
          type="number"
          placeholder="Ej: 100"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />

        <FigmaInput
          label="Máximo"
          type="number"
          placeholder="Ej: 1000"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />

        <button className="figma-btn-primary w-full mt-3" onClick={buscar}>
          Generar Reporte
        </button>
      </div>

      {/* TABLA */}
      <FigmaTable
        columns={[
          "Cliente",
          "Puntos Asignados",
          "Puntos Usados",
          "Saldo",
          "Fecha Asignación",
        ]}
        data={data.map((b) => [
          `${b.cliente.nombre} ${b.cliente.apellido}`,
          `${b.puntos_asignados} pts`,
          `${b.puntos_utilizados} pts`,
          `${b.puntos_asignados - b.puntos_utilizados} pts`,
          b.fecha_asignacion?.substring(0, 10),
        ])}
      />
    </div>
  );
}
