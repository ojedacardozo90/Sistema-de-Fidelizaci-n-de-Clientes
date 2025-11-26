// RUTA: src/pages/consultas/ConsultaCumpleanos.jsx
// -------------------------------------------------------------------
// Consulta de Cumpleaños - Página 21 del PDF (Diseño Figma exacto)
// -------------------------------------------------------------------

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";

export default function ConsultaCumpleanos() {
  const [mes, setMes] = useState("");
  const [data, setData] = useState([]);

  const buscar = () => {
    if (!mes) return;

    api
      .get(`/consultas/cumpleanos/?mes=${mes}`)
      .then((res) => setData(res.data))
      .catch(console.error);
  };

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Cumpleaños de Clientes
      </h1>

      {/* TARJETA DE FILTRO */}
      <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200 mb-8">

        <div className="grid grid-cols-3 gap-6">

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Mes</label>
            <select
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-700 focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccione mes</option>
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              <option value="3">Marzo</option>
              <option value="4">Abril</option>
              <option value="5">Mayo</option>
              <option value="6">Junio</option>
              <option value="7">Julio</option>
              <option value="8">Agosto</option>
              <option value="9">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={buscar}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primaryDark transition"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <FigmaTable
        headers={[
          "Nombre",
          "Apellido",
          "Fecha de nacimiento",
          "Email",
          "Teléfono",
        ]}
        rows={data.map((c) => ({
          Nombre: c.nombre,
          Apellido: c.apellido,
          "Fecha de nacimiento": c.fecha_nacimiento,
          Email: c.email,
          Teléfono: c.telefono,
        }))}
      />
    </div>
  );
}
