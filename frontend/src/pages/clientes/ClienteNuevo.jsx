// RUTA: src/pages/clientes/ClienteNuevo.jsx
// ============================================================
// FORMULARIO PROFESIONAL PARA CREAR CLIENTE
// Compatible con backend Django /clientes/ (POST)
// ============================================================

import { useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import { useNavigate } from "react-router-dom";

export default function ClienteNuevo() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    numero_documento: "",
    tipo_documento: "CI",
    nacionalidad: "Paraguaya",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ------------------------------------------------------------
  // Manejar cambios
  // ------------------------------------------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ------------------------------------------------------------
  // Enviar formulario al backend
  // ------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    api
      .post(endpoints.clientes, form)
      .then(() => {
        setSuccess("Cliente creado exitosamente ✔");
        setTimeout(() => navigate("/clientes"), 1200);
      })
      .catch((err) => {
        setError("Error al crear cliente");
        console.error(err);
      });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">👤 Crear Nuevo Cliente</h2>

      {error && <p className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />

          <input
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="numero_documento"
            placeholder="Número de documento"
            value={form.numero_documento}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />

          <select
            name="tipo_documento"
            value={form.tipo_documento}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="CI">CI</option>
            <option value="PASAPORTE">Pasaporte</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="nacionalidad"
            placeholder="Nacionalidad"
            value={form.nacionalidad}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <input
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          type="date"
          name="fecha_nacimiento"
          value={form.fecha_nacimiento}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold"
        >
          Guardar Cliente
        </button>
      </form>
    </div>
  );
}
