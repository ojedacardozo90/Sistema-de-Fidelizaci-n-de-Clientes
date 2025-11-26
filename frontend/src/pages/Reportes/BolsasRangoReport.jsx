// RUTA: src/pages/reportes/BolsasRangoReport.jsx

import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import FigmaTable from "../../components/base/FigmaTable";

export default function BolsasRangoReport() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    api
      .get("consultas/bolsas_por_rango/")
      .then((res) => setDatos(res.data))
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <div className="page-container animate-fadeIn">

      <h1 className="page-title">Reporte: Bolsas por Rango</h1>

      <div className="figma-card">
        <h3 className="figma-card-title mb-3">Resultados</h3>

        <FigmaTable
          columns={[
            { label: "Cliente", field: "cliente" },
            { label: "Puntos Asignados", field: "puntos_asignados" },
            { label: "Puntos Usados", field: "puntos_utilizados" },
            { label: "Vencimiento", field: "fecha_caducidad" },
          ]}
          data={datos}
        />
      </div>

    </div>
  );
}
