// RUTA: src/pages/servicios/CargarPuntos.jsx
// ============================================================
// FORMULARIO PROFESIONAL PARA CARGAR PUNTOS
// Compatible con backend POST /api/servicios/cargar_puntos/
// ============================================================

import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function CargarPuntos() {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [monto, setMonto] = useState("");
  const [estimacion, setEstimacion] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // ------------------------------------------------------------
  // Cargar lista de clientes al iniciar
  // ------------------------------------------------------------
  useEffect(() => {
    api.get(endpoints.clientes)
       .then(res => setClientes(res.data))
       .catch(err => console.error(err));
  }, []);

  // ------------------------------------------------------------
  // Consultar puntos estimados automáticamente
  // ------------------------------------------------------------
  const calcularEstimacion = async (montoX) => {
    if (!montoX || montoX <= 0) {
      setEstimacion(null);
      return;
    }

    try {
      const res = await api.get(`${endpoints.servicios.puntos_por_monto}?monto=${montoX}`);
      setEstimacion(res.data);
    } catch (e) {
      setEstimacion(null);
    }
  };

  const handleMontoChange = (e) => {
    const value = e.target.value;
    setMonto(value);
    calcularEstimacion(value);
  };

  // ------------------------------------------------------------
  // Enviar formulario al backend
  // ------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!clienteId || !monto) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await api.post(endpoints.servicios.cargar_puntos, {
        cliente_id: clienteId,
        monto_operacion: monto,
      });

      setMensaje("✔ Puntos cargados exitosamente.");
      setEstimacion(null);
      setMonto("");
      setClienteId("");

    } catch (err) {
      setError("Error al cargar puntos");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">➕ Cargar Puntos</h2>

      {error && <p className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</p>}
      {mensaje && <p className="bg-green-100 text-green-700 p-2 mb-4 rounded">{mensaje}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>

        {/* SELECCIÓN DE CLIENTE */}
        <div>
          <label className="block mb-1 font-semibold">Cliente</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.apellido} — {c.numero_documento}
              </option>
            ))}
          </select>
        </div>

        {/* MONTO DE OPERACIÓN */}
        <div>
          <label className="block mb-1 font-semibold">Monto de la operación (Gs.)</label>
          <input
            type="number"
            value={monto}
            onChange={handleMontoChange}
            placeholder="Ej: 250000"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* ESTIMACIÓN DINÁMICA */}
        {estimacion && (
          <div className="bg-blue-50 text-blue-800 p-3 rounded border border-blue-200">
            <p><strong>Puntos estimados:</strong> {estimacion.puntos_estimados}</p>
            <p><strong>Regla aplicada:</strong> {estimacion.regla_aplicada.monto_por_punto} Gs / punto</p>
          </div>
        )}

        {/* BOTÓN */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold"
        >
          Cargar Puntos
        </button>

      </form>
    </div>
  );
}
