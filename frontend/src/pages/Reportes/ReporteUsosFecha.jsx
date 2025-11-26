// RUTA: src/pages/reportes/ReporteUsosFecha.jsx
// =======================================================
// REPORTE: Usos por Fecha Exacta (Versión Figma)
// =======================================================

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ReporteUsosFecha() {
  const [fecha, setFecha] = useState("");
  const [data, setData] = useState([]);

  const buscar = () => {
    if (!fecha) {
      toast.error("Seleccione una fecha.");
      return;
    }

    api
      .get("/api/consultas/usos_fecha/", { params: { fecha } })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Error al obtener usos."));
  };

  const totalUsado = data.reduce((acc, u) => acc + u.puntos_utilizados, 0);

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Reporte — Usos por Fecha</h1>

      {/* FORMULARIO */}
      <div className="card-form mb-8">
        <label className="figma-label mb-1">Fecha</label>
        <input
          type="date"
          className="figma-input"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <button className="figma-btn-primary w-full mt-3" onClick={buscar}>
          Generar Reporte
        </button>
      </div>

      {/* TARJETA RESUMEN */}
      <div className="card p-5 mb-8 flex items-center justify-between">
        <div>
          <h2 className="card-title">Total Utilizado</h2>
          <p className="text-3xl font-bold text-blue-600">
            {totalUsado.toLocaleString()} pts
          </p>
        </div>

        <div className="text-gray-500">
          {data.length} registros encontrados
        </div>
      </div>

      {/* TABLA */}
      <FigmaTable
        columns={[
          "Cliente",
          "Concepto",
          "Puntos",
          "Fecha",
          "Detalle FIFO",
        ]}
        data={data.map((u) => [
          `${u.cliente.nombre} ${u.cliente.apellido}`,
          u.concepto.descripcion,
          `${u.puntos_utilizados} pts`,
          u.fecha.substring(0, 10),
          `${u.detalles.length} bolsas`,
        ])}
      />
    </div>
  );
}
