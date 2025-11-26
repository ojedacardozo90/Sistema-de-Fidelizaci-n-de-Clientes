// RUTA: src/pages/consultas/ConsultaClientesCumple.jsx
// -------------------------------------------------------------------
// Consulta de Clientes por Cumpleaños — Página 36 del PDF
// -------------------------------------------------------------------

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";

export default function ConsultaClientesCumple() {
  const [fecha, setFecha] = useState("");
  const [data, setData] = useState([]);

  const buscar = () => {
    if (!fecha) return;

    api
      .get(`/consultas/clientes_por_cumpleanhos/?fecha=${fecha}`)
      .then((res) => setData(res.data))
      .catch(console.error);
  };

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Clientes por Cumpleaños
      </h1>

      {/* TARJETA FILTROS */}
      <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200 mb-8">

        <div className="grid grid-cols-1 gap-6">
          <FigmaInput
            label="Fecha de nacimiento"
            type="date"
            name="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
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

      {/* TABLA RESULTADOS */}
      <FigmaTable
        headers={["ID", "Nombre", "Apellido", "Documento", "Fecha Nacimiento"]}
        rows={data.map((c) => ({
          ID: c.id,
          Nombre: c.nombre,
          Apellido: c.apellido,
          Documento: c.numero_documento,
          "Fecha Nacimiento": c.fecha_nacimiento,
        }))}
      />
    </div>
  );
}
