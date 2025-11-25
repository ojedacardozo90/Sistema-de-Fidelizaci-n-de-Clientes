import { useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function ClienteForm({ cliente, onSuccess }) {
  const [form, setForm] = useState({
    nombre: cliente?.nombre || "",
    apellido: cliente?.apellido || "",
    numero_documento: cliente?.numero_documento || "",
    tipo_documento: cliente?.tipo_documento || "CI",
    nacionalidad: cliente?.nacionalidad || "Paraguaya",
    email: cliente?.email || "",
    telefono: cliente?.telefono || "",
    fecha_nacimiento: cliente?.fecha_nacimiento || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = () => {
    const request = cliente
      ? api.put(`${endpoints.clientes}${cliente.id}/`, form)
      : api.post(endpoints.clientes, form);

    request
      .then(() => onSuccess())
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-4 w-[400px]">
      <h2 className="text-xl font-bold text-primary">
        {cliente ? "Editar Cliente" : "Registrar Cliente"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange}
               className="border p-2 rounded" />

        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange}
               className="border p-2 rounded" />

        <input name="numero_documento" placeholder="Documento"
               value={form.numero_documento} onChange={handleChange}
               className="border p-2 rounded" />

        <input name="tipo_documento" placeholder="Tipo Doc"
               value={form.tipo_documento} onChange={handleChange}
               className="border p-2 rounded" />

        <input name="nacionalidad" placeholder="Nacionalidad"
               value={form.nacionalidad} onChange={handleChange}
               className="border p-2 rounded" />

        <input name="email" placeholder="Email" value={form.email} onChange={handleChange}
               className="border p-2 rounded" />

        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange}
               className="border p-2 rounded" />

        <input type="date" name="fecha_nacimiento"
               value={form.fecha_nacimiento} onChange={handleChange}
               className="border p-2 rounded" />
      </div>

      <button className="bg-primary text-white w-full py-2 rounded" onClick={save}>
        Guardar
      </button>
    </div>
  );
}
