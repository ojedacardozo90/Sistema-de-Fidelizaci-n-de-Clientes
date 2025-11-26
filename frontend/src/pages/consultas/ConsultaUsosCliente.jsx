// RUTA: src/pages/consultas/ConsultaUsosCliente.jsx
// =======================================================
// Consulta: Usos de Puntos por Cliente (cliente_id)
// =======================================================

import { useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ConsultaUsosCliente() {
  const [clienteId, setClienteId] = useState("");
  const [data, setData] = useState([]);

  const buscar = () => {
    if (!clienteId) {
      toast.error("Ingrese el ID del cliente");
      return;
    }

    api
      .get("/api/consultas/usos_por_cliente/", {
        params: { cliente_id: clienteId },
      })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Error al realizar la consulta."));
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Usos por Cliente</h1>

      {/* FORMULARIO */}
      <div className="card-form mb-6">
        <FigmaInput
          label="ID del Cliente"
          placeholder="Ej: 1"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        />

        <button className="figma-btn-primary w-full mt-3" onClick={buscar}>
          Consultar
        </button>
      </div>

      {/* TABLA */}
      <FigmaTable
        columns={[
          "Cliente",
          "Concepto",
          "Puntos Utilizados",
          "Fecha",
        ]}
        data={data.map((u) => [
          `${u?.cliente?.nombre} ${u?.cliente?.apellido}`,
          u?.concepto?.descripcion,
          `${u?.puntos_utilizados} pts`,
          u?.fecha?.substring(0, 10),
        ])}
      />
    </div>
  );
}
