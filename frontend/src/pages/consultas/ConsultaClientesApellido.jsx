// RUTA: src/pages/consultas/ConsultaClientesApellido.jsx
// -------------------------------------------------------------------
// Consulta de Clientes por Apellido — Página 33 del PDF (Figma)
// -------------------------------------------------------------------

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";

export default function ConsultaClientesApellido() {
  const [apellido, setApellido] = useState("");
  const [data, setData] = useState([]);

  const buscar = () => {
    if (!apellido) return;

    api
      .get(`/consultas/clientes_por_apellido/?apellido=${apellido}`)
      .then((res) => setData(res.data))
      .catch(console.error);
  };

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Clientes por Apellido
      </h1>

      {/* TARJETA DE FILTROS */}
      <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200 mb-8">
        <div className="grid grid-cols-1 gap-6">

          <FigmaInput
            label="Apellido"
            name="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
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

      {/* TABLA */}
      <FigmaTable
        headers={[
          "ID",
          "Nombre",
          "Apellido",
          "Documento",
          "Nacionalidad",
        ]}
        rows={data.map((c) => ({
          ID: c.id,
          Nombre: c.nombre,
          Apellido: c.apellido,
          Documento: c.numero_documento,
          Nacionalidad: c.nacionalidad,
        }))}
      />
    </div>
  );
}
