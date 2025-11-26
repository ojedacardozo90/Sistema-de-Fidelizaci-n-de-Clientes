// RUTA: src/pages/vencimientos/VencimientoForm.jsx
// ------------------------------------------------------
// Formulario EXACTO según el Figma (Página 6)
// ------------------------------------------------------

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

import FigmaInput from "../../components/base/FigmaInput";

export default function VencimientoForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    dias_duracion: ""
  });

  useEffect(() => {
    if (id) {
      api.get(`${endpoints.vencimientos}${id}/`).then((res) => {
        setForm(res.data);
      });
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = () => {
    const request = id
      ? api.put(`${endpoints.vencimientos}${id}/`, form)
      : api.post(endpoints.vencimientos, form);

    request.then(() => navigate("/vencimientos"));
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-8 border border-gray-200">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? "Editar Parametrización" : "Nueva Parametrización"}
      </h1>

      {/* GRID Figma: 2 columnas */}
      <div className="grid grid-cols-2 gap-6">

        <FigmaInput
          label="Fecha inicio"
          name="fecha_inicio"
          type="date"
          value={form.fecha_inicio}
          onChange={handleChange}
        />

        <FigmaInput
          label="Fecha fin"
          name="fecha_fin"
          type="date"
          value={form.fecha_fin}
          onChange={handleChange}
        />

        <FigmaInput
          label="Días de duración"
          name="dias_duracion"
          type="number"
          value={form.dias_duracion}
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
