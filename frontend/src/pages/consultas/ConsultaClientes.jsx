// RUTA: src/pages/consultas/ConsultaClientes.jsx
// =======================================================
// Consulta de Clientes — Segmentación
// (nombre, nacionalidad, rango de edad)
// =======================================================

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ConsultaClientes() {
  const [filtros, setFiltros] = useState({
    nombre: "",
    nacionalidad: "",
    edad_min: "",
    edad_max: "",
  });

  const [data, setData] = useState([]);

  const buscar = () => {
    api
      .get("/api/consultas/clientes_segmentacion/", { params: filtros })
      .then((res) => setData(res.data.clientes || res.data))
      .catch(() => toast.error("Error en la consulta"));
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Consulta de Clientes</h1>

      <div className="card-form mb-6">
        <FigmaInput
          label="Nombre"
          value={filtros.nombre}
          placeholder="Ej: Carlos"
          onChange={(e) =>
            setFiltros({ ...filtros, nombre: e.target.value })
          }
        />

        <FigmaInput
          label="Nacionalidad"
          value={filtros.nacionalidad}
          placeholder="Ej: Paraguaya"
          onChange={(e) =>
            setFiltros({ ...filtros, nacionalidad: e.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <FigmaInput
            label="Edad mínima"
            type="number"
            value={filtros.edad_min}
            onChange={(e) =>
              setFiltros({ ...filtros, edad_min: e.target.value })
            }
          />
          <FigmaInput
            label="Edad máxima"
            type="number"
            value={filtros.edad_max}
            onChange={(e) =>
              setFiltros({ ...filtros, edad_max: e.target.value })
            }
          />
        </div>

        <button className="figma-btn-primary w-full mt-4" onClick={buscar}>
          Buscar
        </button>
      </div>

      <FigmaTable
        columns={[
          "ID",
          "Nombre",
          "Apellido",
          "Documento",
          "Nacionalidad",
          "Email",
        ]}
        data={data.map((c) => [
          c.id,
          c.nombre,
          c.apellido,
          c.numero_documento,
          c.nacionalidad,
          c.email || "-",
        ])}
      />
    </div>
  );
}
