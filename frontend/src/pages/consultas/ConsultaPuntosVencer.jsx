// RUTA: src/pages/consultas/ConsultaPuntosVencer.jsx
// =======================================================
// Consulta: Puntos a vencer en X días
// =======================================================

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ConsultaPuntosVencer() {
  const [dias, setDias] = useState("30");
  const [data, setData] = useState([]);
  const [cantidad, setCantidad] = useState(0);

  const buscar = () => {
    api
      .get("/api/consultas/puntos_a_vencer/", { params: { dias } })
      .then((res) => {
        setCantidad(res.data.cantidad);
        setData(res.data.bolsas || []);
      })
      .catch(() => toast.error("Error al realizar la consulta."));
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Puntos a Vencer</h1>

      {/* --- FORM --- */}
      <div className="card-form mb-6">
        <FigmaInput
          label="Días hasta vencer"
          type="number"
          value={dias}
          onChange={(e) => setDias(e.target.value)}
        />

        <button className="figma-btn-primary w-full mt-3" onClick={buscar}>
          Consultar
        </button>
      </div>

      {/* --- RESULTADOS --- */}
      <div className="mb-4 text-gray-700 font-semibold">
        Resultado: {cantidad} bolsas por vencer
      </div>

      <FigmaTable
        columns={[
          "ID",
          "Cliente",
          "Asignación",
          "Caducidad",
          "Asignados",
          "Usados",
          "Saldo",
          "Estado",
        ]}
        data={data.map((b) => [
          b.id,
          `${b.cliente?.nombre} ${b.cliente?.apellido}`,
          b.fecha_asignacion.substring(0, 10),
          b.fecha_caducidad.substring(0, 10),
          b.puntos_asignados,
          b.puntos_utilizados,
          b.saldo,
          b.estado,
        ])}
      />
    </div>
  );
}
