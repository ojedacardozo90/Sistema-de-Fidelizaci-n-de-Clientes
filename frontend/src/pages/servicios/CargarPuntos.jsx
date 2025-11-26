// RUTA: src/pages/servicios/CargarPuntos.jsx
// ============================================================
// Página: Cargar Puntos (Servicio)
// ============================================================

import { useState, useEffect } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import { toast } from "react-hot-toast";

export default function CargarPuntos() {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [monto, setMonto] = useState("");

  useEffect(() => {
    api.get("/api/clientes/")
      .then((res) => setClientes(res.data.results || res.data))
      .catch(() => toast.error("Error cargando clientes"));
  }, []);

  const enviar = () => {
    if (!clienteId || !monto) {
      toast.error("Complete todos los campos");
      return;
    }

    api.post("/api/servicios/cargar_puntos/", {
      cliente_id: clienteId,
      monto_operacion: monto,
    })
    .then((res) => {
      toast.success(`Puntos asignados: ${res.data.puntos_asignados}`);
      setMonto("");
    })
    .catch(() => toast.error("Error al cargar puntos"));
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Cargar Puntos</h1>

      <div className="card-form">
        {/* Cliente */}
        <label className="figma-label">Cliente</label>
        <select
          className="figma-select mb-4"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="">Seleccione cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>

        {/* Monto */}
        <label className="figma-label">Monto de la operación</label>
        <FigmaInput
          placeholder="Ej: 250000"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          type="number"
          className="mb-4"
        />

        {/* Botón */}
        <button className="figma-btn-primary w-full" onClick={enviar}>
          Cargar Puntos
        </button>
      </div>
    </div>
  );
}
