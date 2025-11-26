// RUTA: src/pages/consultas/ConsultaCumpleanieros.jsx
// =======================================================
// Consulta: Clientes Cumpleañeros por Mes
// =======================================================

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ConsultaCumpleanieros() {
  const [mes, setMes] = useState("");
  const [data, setData] = useState([]);

  const buscar = () => {
    if (!mes || mes < 1 || mes > 12) {
      toast.error("Ingrese un mes válido (1 a 12)");
      return;
    }

    api
      .get("/api/consultas/clientes_cumple/", {
        params: { mes },
      })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Error al obtener los datos."));
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Clientes Cumpleañeros</h1>

      {/* FORMULARIO */}
      <div className="card-form mb-6">
        <FigmaInput
          label="Mes"
          type="number"
          placeholder="Ej: 5"
          min="1"
          max="12"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        />

        <button className="figma-btn-primary w-full mt-3" onClick={buscar}>
          Consultar
        </button>
      </div>

      {/* TABLA */}
      <FigmaTable
        columns={[
          "Cliente",
          "Fecha de Nacimiento",
          "Nacionalidad",
          "Email",
        ]}
        data={data.map((c) => [
          `${c.nombre} ${c.apellido}`,
          c.fecha_nacimiento,
          c.nacionalidad,
          c.email || "-",
        ])}
      />
    </div>
  );
}
