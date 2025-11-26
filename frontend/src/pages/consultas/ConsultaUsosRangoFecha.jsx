// RUTA: src/pages/consultas/ConsultaUsosRangoFecha.jsx
// ------------------------------------------------------------
// Consulta de Usos por Rango de Fecha - Página 19 del PDF
// ------------------------------------------------------------

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";

export default function ConsultaUsosRangoFecha() {
  const [filtros, setFiltros] = useState({
    desde: "",
    hasta: "",
  });

  const [data, setData] = useState([]);

  const handleChange = (e) =>
    setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const buscar = () => {
    if (!filtros.desde || !filtros.hasta) return;

    const params = new URLSearchParams(filtros).toString();

    api
      .get(`/consultas/usos_por_rango_fecha/?${params}`)
      .then((res) => setData(res.data))
      .catch(console.error);
  };

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Usos por Rango de Fecha
      </h1>

      {/* TARJETA DE FILTROS */}
      <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200 mb-8">

        <div className="grid grid-cols-2 gap-6">

          <FigmaInput
            label="Desde"
            name="desde"
            type="date"
            value={filtros.desde}
            onChange={handleChange}
          />

          <FigmaInput
            label="Hasta"
            name="hasta"
            type="date"
            value={filtros.hasta}
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
          "Concepto",
          "Puntos",
          "Fecha",
        ]}
        rows={data.map((u) => ({
          Cliente: `${u.cliente.nombre} ${u.cliente.apellido}`,
          Concepto: u.concepto.descripcion,
          Puntos: u.puntos_utilizados,
          Fecha: u.fecha,
        }))}
      />
    </div>
  );
}
