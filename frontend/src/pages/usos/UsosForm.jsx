import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function UsoForm({ onSuccess }) {
  const [clientes, setClientes] = useState([]);
  const [conceptos, setConceptos] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    cliente_id: "",
    concepto_id: "",
    puntos_requeridos: ""
  });

  useEffect(() => {
    api.get(endpoints.clientes).then(res => setClientes(res.data));
    api.get(endpoints.conceptos).then(res => setConceptos(res.data));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    // Autocompletar puntos requeridos
    if (name === "concepto_id") {
      const c = conceptos.find(x => x.id == value);
      if (c) setForm(f => ({ ...f, puntos_requeridos: c.puntos_requeridos }));
    }
  };

  const save = () => {
    setError("");

    api.post(endpoints.usar_puntos, form)
      .then(() => onSuccess())
      .catch(err => {
        setError(err.response?.data?.detail || err.response?.data?.error || "Error al usar puntos");
      });
  };

  return (
    <div className="space-y-4 w-[420px]">
      <h2 className="text-xl font-bold text-primary">Canjear Puntos</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
      )}

      <label className="text-sm font-semibold">Cliente</label>
      <select
        name="cliente_id"
        value={form.cliente_id}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="">Seleccione…</option>
        {clientes.map(c => (
          <option key={c.id} value={c.id}>
            {c.nombre} {c.apellido}
          </option>
        ))}
      </select>

      <label className="text-sm font-semibold">Concepto</label>
      <select
        name="concepto_id"
        value={form.concepto_id}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="">Seleccione…</option>
        {conceptos.map(c => (
          <option key={c.id} value={c.id}>
            {c.descripcion} — {c.puntos_requeridos} pts
          </option>
        ))}
      </select>

      <label className="text-sm font-semibold">Puntos a Utilizar</label>
      <input
        type="number"
        readOnly
        name="puntos_requeridos"
        value={form.puntos_requeridos}
        className="border p-2 rounded w-full bg-gray-100"
      />

      <button className="bg-primary text-white w-full py-2 rounded" onClick={save}>
        Confirmar Canje
      </button>
    </div>
  );
}
