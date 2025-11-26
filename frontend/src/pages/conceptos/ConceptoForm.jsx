// RUTA: src/pages/conceptos/ConceptoForm.jsx
// ------------------------------------------------------
// Formulario EXACTO según Figma (Página 4)
// ------------------------------------------------------

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

import FigmaInput from "../../components/base/FigmaInput";

export default function ConceptoForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    descripcion: "",
    puntos_requeridos: ""
  });

  useEffect(() => {
    if (id) {
      api.get(`${endpoints.conceptos}${id}/`)
        .then((res) => setForm(res.data));
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = () => {
    const request = id
      ? api.put(`${endpoints.conceptos}${id}/`, form)
      : api.post(endpoints.conceptos, form);

    request.then(() => navigate("/conceptos"));
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-8 border border-gray-200">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? "Editar Concepto" : "Nuevo Concepto"}
      </h1>

      {/* Solo 2 campos según Figma */}
      <div className="grid grid-cols-2 gap-6">

        <FigmaInput
          label="Descripción"
          name="descripcion"
          type="text"
          value={form.descripcion}
          onChange={handleChange}
        />

        <FigmaInput
          label="Puntos requeridos"
          name="puntos_requeridos"
          type="number"
          value={form.puntos_requeridos}
          onChange={handleChange}
        />

      </div>

      {/* Botón guardar */}
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
          Guardar
        </button>
      </div>

    </div>
  );
}
