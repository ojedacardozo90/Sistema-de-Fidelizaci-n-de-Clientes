// RUTA: src/pages/reportes/ReporteUsosCliente.jsx
// =======================================================
// REPORTE: Usos por Cliente (Versión Figma)
// =======================================================

import { useEffect, useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";
import { toast } from "react-hot-toast";

export default function ReporteUsosCliente() {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/api/clientes/")
      .then((res) => setClientes(res.data.results || res.data))
      .catch(() => toast.error("No se pudieron cargar los clientes."));
  }, []);

  const buscar = () => {
    if (!clienteId) {
      toast.error("Seleccione un cliente.");
      return;
    }

    api
      .get("/api/consultas/usos_cliente/", {
        params: { cliente_id: clienteId },
      })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Error al obtener usos del cliente."));
  };

  const totalUsado = data.reduce((acc, u) => acc + u.puntos_utilizados, 0);

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Reporte — Usos por Cliente</h1>

      {/* FORMULARIO */}
      <div className="card-form mb-8">
        <label className="figma-label mb-1">Cliente</label>
        <select
          className="figma-select"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="">Seleccione...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido} — {c.numero_documento}
            </option>
          ))}
        </select>

        <button className="figma-btn-primary w-full mt-3" onClick={buscar}>
          Generar Reporte
        </button>
      </div>

      {/* TARJETA RESUMEN */}
      <div className="card p-5 mb-8 flex items-center justify-between">
        <div>
          <h2 className="card-title">Total Puntos Utilizados</h2>
          <p className="text-3xl font-bold text-blue-600">
            {totalUsado.toLocaleString()} pts
          </p>
        </div>

        <div className="text-gray-500">
          {data.length} registros encontrados
        </div>
      </div>

      {/* TABLA */}
      <FigmaTable
        columns={[
          "Cliente",
          "Concepto",
          "Puntos",
          "Fecha",
          "Detalle FIFO",
        ]}
        data={data.map((u) => [
          `${u.cliente.nombre} ${u.cliente.apellido}`,
          u.concepto.descripcion,
          `${u.puntos_utilizados} pts`,
          u.fecha.substring(0, 10),
          `${u.detalles.length} bolsas`,
        ])}
      />
    </div>
  );
}
