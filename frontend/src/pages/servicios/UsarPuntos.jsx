// RUTA: src/pages/servicios/UsarPuntos.jsx
// ============================================================
// Página: Usar (Canjear) Puntos
// ============================================================

import { useEffect, useState } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import { toast } from "react-hot-toast";

export default function UsarPuntos() {
  const [clientes, setClientes] = useState([]);
  const [conceptos, setConceptos] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [conceptoId, setConceptoId] = useState("");
  const [puntos, setPuntos] = useState("");

  useEffect(() => {
    api.get("/api/clientes/")
      .then((res) => setClientes(res.data.results || res.data));

    api.get("/api/conceptos/")
      .then((res) => setConceptos(res.data.results || res.data));
  }, []);

  const enviar = () => {
    if (!clienteId || !conceptoId || !puntos) {
      toast.error("Complete todos los campos");
      return;
    }

    api.post("/api/servicios/usar_puntos/", {
      cliente_id: clienteId,
      concepto_id: conceptoId,
      puntos_requeridos: puntos,
    })
    .then(() => {
      toast.success("Uso de puntos registrado correctamente");
      setPuntos("");
    })
    .catch((err) => {
      toast.error(err.response?.data?.detail || "Error al usar puntos");
    });
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Usar / Canjear Puntos</h1>

      <div className="card-form">
        {/* CLIENTE */}
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

        {/* CONCEPTO */}
        <label className="figma-label">Concepto</label>
        <select
          className="figma-select mb-4"
          value={conceptoId}
          onChange={(e) => setConceptoId(e.target.value)}
        >
          <option value="">Seleccione concepto</option>
          {conceptos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.descripcion} — {c.puntos_requeridos} pts
            </option>
          ))}
        </select>

        {/* PUNTOS A USAR */}
        <label className="figma-label">Puntos a utilizar</label>
        <FigmaInput
          type="number"
          placeholder="Ej: 200"
          value={puntos}
          onChange={(e) => setPuntos(e.target.value)}
          className="mb-4"
        />

        {/* BOTÓN */}
        <button className="figma-btn-primary w-full" onClick={enviar}>
          Registrar Uso
        </button>
      </div>
    </div>
  );
}
