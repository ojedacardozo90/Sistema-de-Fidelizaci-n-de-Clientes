import { useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function ReglaForm({ regla, onSuccess }) {
  const [form, setForm] = useState({
    limite_inferior: regla?.limite_inferior || "",
    limite_superior: regla?.limite_superior || "",
    monto_por_punto: regla?.monto_por_punto || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = () => {
    const cleanForm = {
      ...form,
      limite_superior: form.limite_superior === "" ? null : form.limite_superior,
    };

    const request = regla
      ? api.put(`${endpoints.reglas}${regla.id}/`, cleanForm)
      : api.post(endpoints.reglas, cleanForm);

    request
      .then(() => onSuccess())
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-4 w-[400px]">
      <h2 className="text-xl font-bold text-primary">
        {regla ? "Editar Regla" : "Nueva Regla"}
      </h2>

      <div className="space-y-3">
        <input
          type="number"
          name="limite_inferior"
          placeholder="Límite inferior"
          value={form.limite_inferior}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          name="limite_superior"
          placeholder="Límite superior (opcional)"
          value={form.limite_superior}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          name="monto_por_punto"
          placeholder="Monto equivalente a 1 punto"
          value={form.monto_por_punto}
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
