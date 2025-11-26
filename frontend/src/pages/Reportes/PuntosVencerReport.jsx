// RUTA: src/pages/reportes/PuntosVencerReport.jsx

import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import FigmaTable from "../../components/base/FigmaTable";

export default function PuntosVencerReport() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    api
      .get("consultas/puntos_a_vencer/")
      .then((res) => setDatos(res.data))
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <div className="page-container animate-fadeIn">
      <h1 className="page-title">Reporte: Puntos por Vencer</h1>

      <div className="figma-card">
        <h3 className="figma-card-title mb-3">Listado</h3>

        <FigmaTable
          columns={[
            { label: "Cliente", field: "cliente" },
            { label: "Puntos", field: "puntos" },
            { label: "Vencimiento", field: "fecha_vencimiento" },
          ]}
          data={datos}
        />
      </div>
    </div>
  );
}
