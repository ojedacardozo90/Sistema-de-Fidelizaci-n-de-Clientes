// RUTA: src/pages/servicios/UsarPuntos.jsx
// ============================================================
// FORMULARIO PROFESIONAL PARA CANJEAR PUNTOS (FIFO)
// Compatible con backend POST /api/servicios/usar_puntos/
// ============================================================

import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function UsarPuntos() {
  const [clientes, setClientes] = useState([]);
  const [conceptos, setConceptos] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [conceptoId, setConceptoId] = useState("");
  
  const [puntosRequeridos, setPuntosRequeridos] = useState("");
  const [puntosDisponibles, setPuntosDisponibles] = useState(null);

  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  // ------------------------------------------------------------
  // Cargar clientes y conceptos al iniciar
  // ------------------------------------------------------------
  useEffect(() => {
    api.get(endpoints.clientes).then(res => setClientes(res.data));
    api.get(endpoints.conceptos).then(res => setConceptos(res.data));
  }, []);

  // ------------------------------------------------------------
  // Cuando seleccionan cliente → obtener puntos disponibles
  // ------------------------------------------------------------
  const fetchDisponibles = async (id) => {
    try {
      const res = await api.get(`${endpoints.bolsas_por_cliente}?cliente_id=${id}`);
      const total = res.data.reduce(
        (acc, b) => acc + (b.puntos_asignados - b.puntos_utilizados),
        0
      );
      setPuntosDisponibles(total);
    } catch (e) {
      setPuntosDisponibles(null);
    }
  };

  const handleClienteChange = (e) => {
    const id = e.target.value;
    setClienteId(id);
    if (id) fetchDisponibles(id);
  };

  // ------------------------------------------------------------
  // Cuando seleccionan concepto → autocompletar puntos requeridos
  // ------------------------------------------------------------
  const handleConceptoChange = (e) => {
    const id = e.target.value;
    setConceptoId(id);

    const concepto = conceptos.find((c) => c.id == id);
    if (concepto) {
      setPuntosRequeridos(concepto.puntos_requeridos);
    }
  };

  // ------------------------------------------------------------
  // Enviar CANJE al backend
  // ------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultado(null);

    if (!clienteId || !conceptoId || !puntosRequeridos) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await api.post(endpoints.servicios.usar_puntos, {
        cliente_id: clienteId,
        concepto_id: conceptoId,
        puntos_requeridos: puntosRequeridos,
      });

      setResultado(res.data);
      fetchDisponibles(clienteId);

    } catch (err) {
      setError("⛔ No tiene suficientes puntos para este canje.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">🔄 Usar / Canjear Puntos</h2>

      {error && <p className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>

        {/* CLIENTE */}
        <div>
          <label className="block mb-1 font-semibold">Cliente</label>
          <select
            value={clienteId}
            onChange={handleClienteChange}
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

        {/* PUNTOS DISPONIBLES */}
        {puntosDisponibles !== null && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded">
            Puntos disponibles: <strong>{puntosDisponibles}</strong>
          </div>
        )}

        {/* CONCEPTO */}
        <div>
          <label className="block mb-1 font-semibold">Concepto</label>
          <select
            value={conceptoId}
            onChange={handleConceptoChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Seleccione un concepto</option>
            {conceptos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.descripcion} — {c.puntos_requeridos} pts
              </option>
            ))}
          </select>
        </div>

        {/* PUNTOS REQUERIDOS */}
        <div>
          <label className="block mb-1 font-semibold">Puntos a utilizar</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={puntosRequeridos}
            onChange={(e) => setPuntosRequeridos(e.target.value)}
            required
          />
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-semibold"
        >
          Usar Puntos
        </button>
      </form>

      {/* ====================================================== */}
      {/* RESULTADO DEL CANJE (DETALLE FIFO DEL BACKEND) */}
      {/* ====================================================== */}
      {resultado && (
        <div className="mt-6 bg-gray-50 border p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">✔ Canje realizado</h3>

          <p><strong>Total usado:</strong> {resultado.puntos_utilizados} puntos</p>
          <p><strong>Concepto:</strong> {resultado.concepto.descripcion}</p>

          <h4 className="font-semibold mt-4 mb-2">Detalle de Bolsas (FIFO)</h4>
          <ul className="space-y-2">
            {resultado.detalles.map((d) => (
              <li
                key={d.id}
                className="p-2 bg-white rounded border shadow-sm text-sm"
              >
                <strong>Bolsa #{d.bolsa_id}</strong> — {d.puntos_utilizados} puntos  
                <br />
                <span className="text-gray-600 text-xs">
                  Caduca: {new Date(d.fecha_caducidad).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
