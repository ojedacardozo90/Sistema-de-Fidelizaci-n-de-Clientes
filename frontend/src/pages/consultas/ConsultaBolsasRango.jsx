// RUTA: src/pages/consultas/ConsultaBolsasRango.jsx
// =======================================================
// Bolsas por Rango de Puntos
// =======================================================

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ConsultaBolsasRango() {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [data, setData] = useState([]);

  const buscar = () => {
    api
      .get("/api/consultas/bolsas_por_rango/", {
        params: { min, max },
      })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Error en la consulta"));
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Bolsas por Rango de Puntos</h1>

      <div className="card-form mb-6">

        <FigmaInput
          label="Mínimo"
          type="number"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />

        <FigmaInput
          label="Máximo"
          type="number"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />

        <button className="figma-btn-primary w-full" onClick={buscar}>
          Buscar
        </button>
      </div>

      <FigmaTable
        columns={[
          "ID",
          "Asignación",
          "Caducidad",
          "Asignados",
          "Usados",
          "Estado",
        ]}
        data={data.map((b) => [
          b.id,
          b.fecha_asignacion.substring(0, 10),
          b.fecha_caducidad.substring(0, 10),
          b.puntos_asignados,
          b.puntos_utilizados,
          b.estado,
        ])}
      />
    </div>
  );
}
