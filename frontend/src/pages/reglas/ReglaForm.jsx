// RUTA: src/pages/reglas/ReglaForm.jsx
// ------------------------------------------------------
// Formulario EXACTO según Figma (Página 5)
// ------------------------------------------------------

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

import FigmaInput from "../../components/base/FigmaInput";

export default function ReglaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    limite_inferior: "",
    limite_superior: "",
    monto_por_punto: ""
  });

  useEffect(() => {
    if (id) {
      api.get(`${endpoints.reglas}${id}/`)
        .then((res) => setForm(res.data));
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = () => {
    const request = id
      ? api.put(`${endpoints.reglas}${id}/`, form)
      : api.post(endpoints.reglas, form);

    request.then(() => navigate("/reglas"));
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-8 border border-gray-200">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? "Editar Regla de Puntos" : "Nueva Regla de Puntos"}
      </h1>

      {/* GRID Figma: 2 columnas */}
      <div className="grid grid-cols-2 gap-6">

        <FigmaInput
          label="Límite inferior"
          name="limite_inferior"
          type="number"
          value={form.limite_inferior}
          onChange={handleChange}
        />

        <FigmaInput
          label="Límite superior"
          name="limite_superior"
          type="number"
          value={form.limite_superior}
          onChange={handleChange}
        />

        <FigmaInput
          label="Monto por punto (Gs.)"
          name="monto_por_punto"
          type="number"
          value={form.monto_por_punto}
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
