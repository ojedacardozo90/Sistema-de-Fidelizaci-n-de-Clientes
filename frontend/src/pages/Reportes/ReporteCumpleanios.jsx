// RUTA: src/pages/reportes/ReporteCumpleanios.jsx
// =======================================================
// REPORTE: Cumpleaños por Mes / Día (Versión Figma)
// =======================================================

import { useState } from "react";
import api from "../../services/api";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ReporteCumpleanios() {
  const [mes, setMes] = useState("");
  const [dia, setDia] = useState("");
  const [data, setData] = useState([]);

  const meses = [
    { id: 1, nombre: "Enero" },
    { id: 2, nombre: "Febrero" },
    { id: 3, nombre: "Marzo" },
    { id: 4, nombre: "Abril" },
    { id: 5, nombre: "Mayo" },
    { id: 6, nombre: "Junio" },
    { id: 7, nombre: "Julio" },
    { id: 8, nombre: "Agosto" },
    { id: 9, nombre: "Septiembre" },
    { id: 10, nombre: "Octubre" },
    { id: 11, nombre: "Noviembre" },
    { id: 12, nombre: "Diciembre" },
  ];

  const buscar = () => {
    if (!mes) {
      toast.error("Seleccione un mes.");
      return;
    }

    api
      .get("/api/consultas/clientes_cumpleanios/", {
        params: { mes, dia },
      })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Error al obtener clientes cumpleañeros."));
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Reporte — Cumpleaños</h1>

      {/* FORMULARIO */}
      <div className="card-form grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* MES */}
        <div>
          <label className="figma-label">Mes</label>
          <select
            className="figma-select"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          >
            <option value="">Seleccione...</option>
            {meses.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* DÍA */}
        <div>
          <label className="figma-label">Día (opcional)</label>
          <input
            type="number"
            min="1"
            max="31"
            className="figma-input"
            value={dia}
            placeholder="Ej: 15"
            onChange={(e) => setDia(e.target.value)}
          />
        </div>

        {/* BOTÓN */}
        <button
          className="figma-btn-primary col-span-1 md:col-span-1"
          onClick={buscar}
        >
          Generar Reporte
        </button>
      </div>

      {/* TARJETA RESUMEN */}
      <div className="card p-5 mb-8 flex items-center justify-between">
        <div>
          <h2 className="card-title">Total de Cumpleañeros</h2>
          <p className="text-3xl font-bold text-blue-600">{data.length}</p>
        </div>

        <div className="text-gray-500">
          {mes && (
            <span>
              {meses.find((m) => m.id == mes)?.nombre}
              {dia && ` — Día ${dia}`}
            </span>
          )}
        </div>
      </div>

      {/* TABLA */}
      <FigmaTable
        columns={[
          "Nombre",
          "Apellido",
          "Documento",
          "Nacionalidad",
          "Fecha de Nacimiento",
        ]}
        data={data.map((c) => [
          c.nombre,
          c.apellido,
          c.numero_documento,
          c.nacionalidad,
          c.fecha_nacimiento,
        ])}
      />
    </div>
  );
}
