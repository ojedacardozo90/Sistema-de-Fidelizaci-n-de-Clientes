import { useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function ConceptoForm({ concepto, onSuccess }) {
  const [form, setForm] = useState({
    descripcion: concepto?.descripcion || "",
    puntos_requeridos: concepto?.puntos_requeridos || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = () => {
    const request = concepto
      ? api.put(`${endpoints.conceptos}${concepto.id}/`, form)
      : api.post(endpoints.conceptos, form);

    request
      .then(() => onSuccess())
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-4 w-[380px]">
      <h2 className="text-xl font-bold text-primary">
        {concepto ? "Editar Concepto" : "Nuevo Concepto"}
      </h2>

      <div className="space-y-3">
        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          name="puntos_requeridos"
          placeholder="Puntos requeridos"
          value={form.puntos_requeridos}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <button className="bg-primary text-white w-full py-2 rounded" onClick={save}>
        Guardar
      </button>
    </div>
  );
}
