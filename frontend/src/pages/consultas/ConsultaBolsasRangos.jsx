// RUTA: src/pages/consultas/ConsultaBolsasRango.jsx
// -----------------------------------------------------------------
// Consulta de Bolsas por Rango de Puntos - Página 14 del PDF (Figma)
// -----------------------------------------------------------------

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";

export default function ConsultaBolsasRango() {
  const [filtros, setFiltros] = useState({
    min: "",
    max: "",
  });

  const [data, setData] = useState([]);

  const handleChange = (e) =>
    setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const buscar = () => {
    const params = new URLSearchParams(filtros).toString();

    api
      .get(`/consultas/bolsas_por_rango/?${params}`)
      .then((res) => setData(res.data.bolsas ?? res.data))
      .catch(console.error);
  };

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Consulta de Bolsas por Rango de Puntos
      </h1>

      {/* TARJETA CON FILTROS */}
      <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200 mb-8">

        <div className="grid grid-cols-2 gap-6">

          <FigmaInput
            label="Puntos Mínimos"
            type="number"
            name="min"
            value={filtros.min}
            onChange={handleChange}
          />

          <FigmaInput
            label="Puntos Máximos"
            type="number"
            name="max"
            value={filtros.max}
            onChange={handleChange}
          />

        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={buscar}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primaryDark transition"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* TABLA RESULTADOS */}
      <FigmaTable
        headers={[
          "Cliente",
          "Puntos Asignados",
          "Fecha Asignación",
        ]}
        rows={data.map((b) => ({
          Cliente: `${b.cliente.nombre} ${b.cliente.apellido}`,
          "Puntos Asignados": b.puntos_asignados,
          "Fecha Asignación": b.fecha_asignacion?.slice(0, 10),
        }))}
      />
    </div>
  );
}
