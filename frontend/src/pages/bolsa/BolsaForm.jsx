import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function BolsaForm({ item, onSuccess }) {
  const [clientes, setClientes] = useState([]);

  const [form, setForm] = useState({
    cliente_id: item?.cliente?.id || "",
    fecha_asignacion: item?.fecha_asignacion?.slice(0, 10) || "",
    fecha_caducidad: item?.fecha_caducidad?.slice(0, 10) || "",
    puntos_asignados: item?.puntos_asignados || "",
    puntos_utilizados: item?.puntos_utilizados || "",
    monto_operacion: item?.monto_operacion || "",
    estado: item?.estado || "ACTIVO",
  });

  useEffect(() => {
    api.get(endpoints.clientes)
      .then((res) => setClientes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = () => {
    const request = item
      ? api.put(`${endpoints.bolsas}${item.id}/`, form)
      : api.post(endpoints.bolsas, form);

    request
      .then(() => onSuccess())
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-4 w-[420px]">
      <h2 className="text-xl font-bold text-primary">
        {item ? "Editar Bolsa de Puntos" : "Nueva Bolsa de Puntos"}
      </h2>

      <label className="text-sm font-semibold">Cliente</label>
      <select
        name="cliente_id"
        value={form.cliente_id}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="">Seleccione…</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre} {c.apellido}
          </option>
        ))}
      </select>

      <label className="text-sm font-semibold">Fecha Asignación</label>
      <input
        type="date"
        name="fecha_asignacion"
        value={form.fecha_asignacion}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <label className="text-sm font-semibold">Fecha Caducidad</label>
      <input
        type="date"
        name="fecha_caducidad"
        value={form.fecha_caducidad}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <label className="text-sm font-semibold">Puntos Asignados</label>
      <input
        type="number"
        name="puntos_asignados"
        value={form.puntos_asignados}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <label className="text-sm font-semibold">Puntos Utilizados</label>
      <input
        type="number"
        name="puntos_utilizados"
        value={form.puntos_utilizados}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <label className="text-sm font-semibold">Monto Operación</label>
      <input
        type="number"
        name="monto_operacion"
        value={form.monto_operacion}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <label className="text-sm font-semibold">Estado</label>
      <select
        name="estado"
        value={form.estado}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="ACTIVO">ACTIVO</option>
        <option value="AGOTADO">AGOTADO</option>
        <option value="VENCIDO">VENCIDO</option>
      </select>

      <button className="bg-primary text-white w-full py-2 rounded" onClick={save}>
        Guardar
      </button>
    </div>
  );
}
