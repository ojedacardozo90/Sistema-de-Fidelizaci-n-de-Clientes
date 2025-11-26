// RUTA: src/pages/bolsas/BolsaForm.jsx
// ------------------------------------------------------
// Formulario EXACTO según el Figma (Página 7)
// ------------------------------------------------------

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

import FigmaInput from "../../components/base/FigmaInput";

export default function BolsaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);

  const [form, setForm] = useState({
    cliente: "",
    fecha_asignacion: "",
    fecha_caducidad: "",
    puntos_asignados: "",
    monto_operacion: ""
  });

  // Cargar clientes
  useEffect(() => {
    api.get(endpoints.clientes).then((res) => setClientes(res.data));

    if (id) {
      api.get(`${endpoints.bolsas}${id}/`).then((res) => {
        setForm(res.data);
      });
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = () => {
    const request = id
      ? api.put(`${endpoints.bolsas}${id}/`, form)
      : api.post(endpoints.bolsas, form);

    request.then(() => navigate("/bolsas"));
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-8 border border-gray-200">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? "Editar Bolsa de Puntos" : "Nueva Bolsa de Puntos"}
      </h1>

      {/* GRID Figma: 2 columnas */}
      <div className="grid grid-cols-2 gap-6">

        {/* SELECT Cliente */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-semibold mb-1">
            Cliente
          </label>
          <select
            name="cliente"
            value={form.cliente}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Seleccione cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.apellido} — {c.numero_documento}
              </option>
            ))}
          </select>
        </div>

        <FigmaInput
          label="Fecha Asignación"
          name="fecha_asignacion"
          type="date"
          value={form.fecha_asignacion}
          onChange={handleChange}
        />

        <FigmaInput
          label="Fecha Caducidad"
          name="fecha_caducidad"
          type="date"
          value={form.fecha_caducidad}
          onChange={handleChange}
        />

        <FigmaInput
          label="Puntos Asignados"
          name="puntos_asignados"
          type="number"
          value={form.puntos_asignados}
          onChange={handleChange}
        />

        <FigmaInput
          label="Monto de la operación (Gs.)"
          name="monto_operacion"
          type="number"
          value={form.monto_operacion}
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
