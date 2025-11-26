// RUTA: src/pages/consultas/ConsultaBolsasCliente.jsx
// =======================================================
// Bolsas de puntos — por Cliente
// =======================================================

import { useEffect, useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ConsultaBolsasCliente() {
  const [clientes, setClientes] = useState([]);
  const [idCliente, setIdCliente] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/api/clientes/").then((res) =>
      setClientes(res.data.results || res.data)
    );
  }, []);

  const buscar = () => {
    if (!idCliente) {
      toast.error("Seleccione un cliente");
      return;
    }

    api
      .get("/api/consultas/bolsas_por_cliente/", {
        params: { cliente_id: idCliente },
      })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Error en la consulta"));
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Bolsas por Cliente</h1>

      <div className="card-form mb-6">
        <label className="figma-label">Cliente</label>

        <select
          className="figma-select mb-4"
          value={idCliente}
          onChange={(e) => setIdCliente(e.target.value)}
        >
          <option value="">Seleccione...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>

        <button className="figma-btn-primary w-full" onClick={buscar}>
          Buscar
        </button>
      </div>

      <FigmaTable
        columns={[
          "ID",
          "Asignación",
          "Caducidad",
          "Asignados",
          "Usados",
          "Estado",
        ]}
        data={data.map((b) => [
          b.id,
          b.fecha_asignacion.substring(0, 10),
          b.fecha_caducidad.substring(0, 10),
          b.puntos_asignados,
          b.puntos_utilizados,
          b.estado,
        ])}
      />
    </div>
  );
}
