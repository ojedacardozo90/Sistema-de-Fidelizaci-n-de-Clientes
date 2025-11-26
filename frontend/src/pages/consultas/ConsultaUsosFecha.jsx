// RUTA: src/pages/consultas/ConsultaUsosFecha.jsx
// =======================================================
// Consulta: Usos por Fecha Exacta
// =======================================================

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ConsultaUsosFecha() {
  const [fecha, setFecha] = useState("");
  const [data, setData] = useState([]);

  const buscar = () => {
    if (!fecha) {
      toast.error("Seleccione una fecha");
      return;
    }

    api
      .get("/api/consultas/usos_por_fecha/", {
        params: { fecha },
      })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Error al realizar la consulta."));
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Usos por Fecha</h1>

      {/* === FORM === */}
      <div className="card-form mb-6">
        <FigmaInput
          label="Fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <button className="figma-btn-primary w-full mt-3" onClick={buscar}>
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
