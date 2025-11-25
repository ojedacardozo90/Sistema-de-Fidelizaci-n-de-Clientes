import { useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function VencimientoForm({ item, onSuccess }) {
  const [form, setForm] = useState({
    fecha_inicio: item?.fecha_inicio || "",
    fecha_fin: item?.fecha_fin || "",
    dias_duracion: item?.dias_duracion || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = () => {
    const request = item
      ? api.put(`${endpoints.vencimientos}${item.id}/`, form)
      : api.post(endpoints.vencimientos, form);

    request
      .then(() => onSuccess())
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-4 w-[400px]">
      <h2 className="text-xl font-bold text-primary">
        {item ? "Editar Parametrización" : "Nueva Parametrización"}
      </h2>

      <div className="space-y-3">
        <label className="text-sm font-semibold">Fecha de Inicio</label>
        <input
          type="date"
          name="fecha_inicio"
          value={form.fecha_inicio}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <label className="text-sm font-semibold">Fecha de Fin</label>
        <input
          type="date"
          name="fecha_fin"
          value={form.fecha_fin}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <label className="text-sm font-semibold">Días de Duración</label>
        <input
          type="number"
          name="dias_duracion"
          value={form.dias_duracion}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          min="1"
        />
      </div>

      <button className="bg-primary text-white w-full py-2 rounded" onClick={save}>
        Guardar
      </button>
    </div>
  );
}
