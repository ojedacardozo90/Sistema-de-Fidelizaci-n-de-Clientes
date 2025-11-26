// RUTA: src/pages/reportes/ReporteUsosRangoFecha.jsx
// =======================================================
// REPORTE: Usos por Rango de Fechas (Versión Figma)
// =======================================================

import { useState } from "react";
import api from "../../services/api";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ReporteUsosRangoFecha() {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [data, setData] = useState([]);

  const buscar = () => {
    if (!desde || !hasta) {
      toast.error("Seleccione ambas fechas.");
      return;
    }

    api
      .get("/api/consultas/usos_por_rango_fecha/", {
        params: { desde, hasta },
      })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Error al obtener usos en el rango de fechas."));
  };

  const totalUsados = data.reduce((acc, u) => acc + u.puntos_utilizados, 0);

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">
        Reporte — Usos por Rango de Fechas
      </h1>

      {/* FORMULARIO */}
      <div className="card-form grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="figma-label">Desde</label>
          <input
            type="date"
            className="figma-input"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
        </div>

        <div>
          <label className="figma-label">Hasta</label>
          <input
            type="date"
            className="figma-input"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
          />
        </div>

        <button
          className="figma-btn-primary col-span-1 md:col-span-2"
          onClick={buscar}
        >
          Generar Reporte
        </button>
      </div>

      {/* TARJETA RESUMEN */}
      <div className="card p-5 mb-8 flex items-center justify-between">
        <div>
          <h2 className="card-title">Total de Puntos Utilizados</h2>
          <p className="text-3xl font-bold text-blue-600">
            {totalUsados.toLocaleString()} pts
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
