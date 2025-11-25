// RUTA: src/pages/conceptos/Conceptos.jsx
//-----------------------------------------------------------
// CRUD COMPLETO DE CONCEPTOS DE PUNTOS
//-----------------------------------------------------------

import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function Conceptos() {
  const [conceptos, setConceptos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    descripcion: "",
    puntos_requeridos: "",
  });

  const cargarConceptos = () => {
    api
      .get(endpoints.conceptos)
      .then((res) =>
        setConceptos(
          res.data !== null &&
          res.data !== undefined &&
          Array.isArray(res.data.results)
            ? res.data.results
            : []
        )
      )
      .catch((err) => console.error(err));
  };

  useEffect(() => cargarConceptos(), []);

  const abrirCrear = () => {
    setEditMode(false);
    setForm({ descripcion: "", puntos_requeridos: "" });
    setModalOpen(true);
  };

  const abrirEditar = (item) => {
    setEditMode(true);
    setSelectedId(item.id);
    setForm(item);
    setModalOpen(true);
  };

  const guardar = () => {
    if (editMode) {
      api
        .put(`${endpoints.conceptos}${selectedId}/`, form)
        .then(() => {
          cargarConceptos();
          setModalOpen(false);
        })
        .catch(console.error);
    } else {
      api
        .post(endpoints.conceptos, form)
        .then(() => {
          cargarConceptos();
          setModalOpen(false);
        })
        .catch(console.error);
    }
  };

  const eliminar = (id) => {
    if (!window.confirm("¿Eliminar concepto?")) return;
    api
      .delete(`${endpoints.conceptos}${id}/`)
      .then(cargarConceptos)
      .catch(console.error);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Conceptos</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={abrirCrear}
        >
          + Nuevo Concepto
        </button>
      </div>

      <table className="min-w-full bg-white shadow rounded mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Descripción</th>
            <th className="py-2 px-4">Puntos Requeridos</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {conceptos.map((c) => (
            <tr key={c.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{c.id}</td>
              <td className="py-2 px-4">{c.descripcion}</td>
              <td className="py-2 px-4">{c.puntos_requeridos}</td>

              <td className="py-2 px-4 flex gap-2">
                <button
                  className="bg-yellow-500 px-3 py-1 rounded text-white"
                  onClick={() => abrirEditar(c)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-600 px-3 py-1 rounded text-white"
                  onClick={() => eliminar(c.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-3">
              {editMode ? "Editar Concepto" : "Nuevo Concepto"}
            </h3>

            <div className="space-y-3">
              <input
                className="w-full px-3 py-2 border rounded"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />
              <input
                className="w-full px-3 py-2 border rounded"
                placeholder="Puntos requeridos"
                type="number"
                value={form.puntos_requeridos}
                onChange={(e) =>
                  setForm({ ...form, puntos_requeridos: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 rounded text-white"
                onClick={guardar}
              >
                {editMode ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
