// RUTA: src/pages/usos/UsoForm.jsx
// FORM Figma — Uso de Puntos (FIFO)

import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

import FigmaInput from "../../components/base/FigmaInput";
import FigmaButton from "../../components/base/FigmaButton";

export default function UsoForm({ uso, onSuccess }) {
  const [clientes, setClientes] = useState([]);
  const [conceptos, setConceptos] = useState([]);

  const [form, setForm] = useState({
    cliente_id: uso?.cliente?.id || "",
    concepto_id: uso?.concepto?.id || "",
    puntos_utilizados: uso?.puntos_utilizados || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // CARGAR CLIENTES Y CONCEPTOS
  useEffect(() => {
    api.get(endpoints.clientes).then((r) => setClientes(r.data));
    api.get(endpoints.conceptos).then((r) => setConceptos(r.data));
  }, []);

  const save = () => {
    api
      .post(endpoints.usar_puntos, form)
      .then(onSuccess)
      .catch((err) => {
        alert(err.response?.data?.error || "Error al usar puntos");
      });
  };

  // SI ES SOLO VISUALIZAR DETALLE
  if (uso) {
    return (
      <div className="w-[500px] space-y-4">
        <h2 className="text-2xl font-bold text-figmaPrimary">Detalle del Uso</h2>

        <div className="bg-white shadow-card rounded-lg p-4">
          <p className="text-lg">
            Cliente:{" "}
            <b>
              {uso.cliente.nombre} {uso.cliente.apellido}
            </b>
          </p>
          <p>Concepto: <b>{uso.concepto.descripcion}</b></p>
          <p>Puntos Utilizados: <b>{uso.puntos_utilizados}</b></p>
          <p>Fecha: {new Date(uso.fecha).toLocaleString()}</p>
        </div>

        <h3 className="text-xl font-semibold text-grayDark">Consumo FIFO</h3>

        {uso.detalles.map((d) => (
          <div
            key={d.id}
            className="bg-lightBg border border-grayLight rounded-lg p-3"
          >
            <p>Bolsa ID: <b>{d.bolsa_id}</b></p>
            <p>Puntos descontados: <b>{d.puntos_utilizados}</b></p>
            <p>Caduca: {new Date(d.fecha_caducidad).toLocaleString()}</p>
          </div>
        ))}
      </div>
    );
  }

  // FORMULARIO PARA CREAR USO
  return (
    <div className="w-[500px] space-y-4">

      <h2 className="text-2xl font-bold text-figmaPrimary">Nuevo Uso de Puntos</h2>

      {/* SELECT CLIENTE */}
      <div className="flex flex-col gap-1">
        <label className="text-grayDark font-medium">Cliente</label>
        <select
          name="cliente_id"
          value={form.cliente_id}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-figmaPrimary"
        >
          <option value="">Seleccione...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>
      </div>

      {/* SELECT CONCEPTO */}
      <div className="flex flex-col gap-1">
        <label className="text-grayDark font-medium">Concepto</label>
        <select
          name="concepto_id"
          value={form.concepto_id}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-figmaPrimary"
        >
          <option value="">Seleccione...</option>
          {conceptos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.descripcion}
            </option>
          ))}
        </select>
      </div>

      <FigmaInput
        label="Puntos a Utilizar"
        type="number"
        name="puntos_utilizados"
        value={form.puntos_utilizados}
        onChange={handleChange}
      />

      <FigmaButton className="w-full" onClick={save}>
        Confirmar Uso
      </FigmaButton>
    </div>
  );
}
