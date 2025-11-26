import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

import FigmaInput from "../../components/base/FigmaInput";

export default function ClienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    numero_documento: "",
    tipo_documento: "",
    nacionalidad: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (id) {
      api.get(`${endpoints.clientes}${id}/`).then((res) => {
        setForm(res.data);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = () => {
    const request = id
      ? api.put(`${endpoints.clientes}${id}/`, form)
      : api.post(endpoints.clientes, form);

    request.then(() => navigate("/clientes"));
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-8 border border-gray-200">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? "Editar Cliente" : "Nuevo Cliente"}
      </h1>

      {/* GRID 2 COLUMNAS EXACTO COMO FIGMA */}
      <div className="grid grid-cols-2 gap-6">

        <FigmaInput
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
        />

        <FigmaInput
          label="Apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
        />

        <FigmaInput
          label="Número de Documento"
          name="numero_documento"
          value={form.numero_documento}
          onChange={handleChange}
        />

        <FigmaInput
          label="Tipo de Documento"
          name="tipo_documento"
          value={form.tipo_documento}
          onChange={handleChange}
        />

        <FigmaInput
          label="Nacionalidad"
          name="nacionalidad"
          value={form.nacionalidad}
          onChange={handleChange}
        />

        <FigmaInput
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <FigmaInput
          label="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
        />

        <FigmaInput
          label="Fecha de Nacimiento"
          type="date"
          name="fecha_nacimiento"
          value={form.fecha_nacimiento}
          onChange={handleChange}
        />

      </div>

      {/* BOTÓN GUARDAR IGUAL FIGMA */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={guardar}
          className="
            bg-primary 
            text-white 
            px-6 py-3 
            rounded-lg 
            font-semibold 
            hover:bg-primaryDark 
            transition
          "
        >
          Guardar Cliente
        </button>
      </div>

    </div>
  );
}
