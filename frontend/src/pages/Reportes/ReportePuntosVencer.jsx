// RUTA: src/pages/reportes/ReportePuntosVencer.jsx
// =======================================================
// REPORTE: Puntos por Vencer (Versión Visual Figma)
// =======================================================

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ReportePuntosVencer() {
  const [dias, setDias] = useState("");
  const [data, setData] = useState([]);

  const buscar = () => {
    if (!dias || dias <= 0) {
      toast.error("Ingrese un número válido de días.");
      return;
    }

    api
      .get("/api/consultas/puntos_a_vencer/", { params: { dias } })
      .then((res) => {
        setData(res.data);
      })
      .catch(() => toast.error("No se pudo obtener los datos."));
  };

  const totalPuntos = data.reduce(
    (acc, b) => acc + (b.puntos_asignados - b.puntos_utilizados),
    0
  );

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Reporte — Puntos por Vencer</h1>

      {/* FORMULARIO */}
      <div className="card-form mb-8">
        <FigmaInput
          label="Días para el Vencimiento"
          type="number"
          placeholder="Ej: 30"
          value={dias}
          onChange={(e) => setDias(e.target.value)}
        />

        <button className="figma-btn-primary w-full mt-3" onClick={buscar}>
          Generar Reporte
        </button>
      </div>

      {/* TARJETA RESUMEN */}
      <div className="card p-5 mb-8 flex justify-between items-center">
        <div>
          <h2 className="card-title">Total de puntos por vencer</h2>
          <p className="text-3xl font-semibold text-blue-600">
            {totalPuntos.toLocaleString()} pts
          </p>
        </div>

        <div className="text-gray-500">
          Basado en {data.length} bolsas encontradas
        </div>
      </div>

      {/* TABLA */}
      <FigmaTable
        columns={[
          "Cliente",
          "Puntos Asignados",
          "Puntos Usados",
          "Saldo",
          "Fecha Asignación",
          "Fecha Caducidad",
        ]}
        data={data.map((b) => [
          `${b.cliente.nombre} ${b.cliente.apellido}`,
          `${b.puntos_asignados} pts`,
          `${b.puntos_utilizados} pts`,
          `${b.puntos_asignados - b.puntos_utilizados} pts`,
          b.fecha_asignacion?.substring(0, 10),
          b.fecha_caducidad?.substring(0, 10),
        ])}
      />
    </div>
  );
}
