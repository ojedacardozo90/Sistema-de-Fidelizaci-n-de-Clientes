// RUTA: src/pages/reglas/Reglas.jsx
//-----------------------------------------------------------
// CRUD COMPLETO DE REGLAS DE PUNTOS
// Compatible con Django REST Framework (ModelViewSet)
//-----------------------------------------------------------

import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function Reglas() {
  const [reglas, setReglas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    limite_inferior: "",
    limite_superior: "",
    monto_por_punto: "",
  });

  // ------------------------------------------------------------
  // Cargar reglas desde el backend (CORREGIDO)
  // ------------------------------------------------------------
  const cargarReglas = () => {
    api
      .get(endpoints.reglas)
      .then((res) =>
        setReglas(
          res.data !== null &&
            res.data !== undefined &&
            typeof res.data === "object" &&
            Array.isArray(res.data.results)
            ? res.data.results
            : []
        )
      )
      .catch((err) => console.error(err));
  };

  useEffect(() => cargarReglas(), []);

  // ------------------------------------------------------------
  // Abrir modal para CREAR
  // ------------------------------------------------------------
  const abrirCrear = () => {
    setEditMode(false);
    setForm({
      limite_inferior: "",
      limite_superior: "",
      monto_por_punto: "",
    });
    setModalOpen(true);
  };

  // ------------------------------------------------------------
  // Abrir modal para EDITAR
  // ------------------------------------------------------------
  const abrirEditar = (item) => {
    setEditMode(true);
    setSelectedId(item.id);
    setForm(item);
    setModalOpen(true);
  };

  // ------------------------------------------------------------
  // Guardar (CREATE / UPDATE)
  // ------------------------------------------------------------
  const guardar = () => {
    const payload = {
      ...form,
      limite_superior: form.limite_superior || null,
    };

    if (editMode) {
      api
        .put(`${endpoints.reglas}${selectedId}/`, payload)
        .then(() => {
          cargarReglas();
          setModalOpen(false);
        })
        .catch(console.error);
    } else {
      api
        .post(endpoints.reglas, payload)
        .then(() => {
          cargarReglas();
          setModalOpen(false);
        })
        .catch(console.error);
    }
  };

  // ------------------------------------------------------------
  // Eliminar
  // ------------------------------------------------------------
  const eliminar = (id) => {
    if (!window.confirm("¿Eliminar regla de puntos?")) return;

    api
      .delete(`${endpoints.reglas}${id}/`)
      .then(cargarReglas)
      .catch(console.error);
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Reglas de Puntos</h2>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={abrirCrear}
        >
          + Nueva Regla
        </button>
      </div>

      {/* TABLA */}
      <table className="min-w-full bg-white shadow rounded mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Límite Inferior</th>
            <th className="py-2 px-4">Límite Superior</th>
            <th className="py-2 px-4">Monto por Punto</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {reglas.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{r.id}</td>
              <td className="py-2 px-4">{r.limite_inferior}</td>
              <td className="py-2 px-4">{r.limite_superior ?? "∞"}</td>
              <td className="py-2 px-4">{r.monto_por_punto}</td>

              <td className="py-2 px-4 flex gap-2">
                <button
                  className="bg-yellow-500 px-3 py-1 rounded text-white"
                  onClick={() => abrirEditar(r)}
                >
                  Editar
                </button>

                <button
                  className="bg-red-600 px-3 py-1 rounded text-white"
                  onClick={() => eliminar(r.id)}
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
              {editMode ? "Editar Regla" : "Nueva Regla"}
            </h3>

            <div className="space-y-3">
              <input
                className="w-full px-3 py-2 border rounded"
                placeholder="Límite Inferior"
                type="number"
                value={form.limite_inferior}
                onChange={(e) =>
                  setForm({ ...form, limite_inferior: e.target.value })
                }
              />

              <input
                className="w-full px-3 py-2 border rounded"
                placeholder="Límite Superior (opcional)"
                type="number"
                value={form.limite_superior ?? ""}
                onChange={(e) =>
                  setForm({ ...form, limite_superior: e.target.value })
                }
              />

              <input
                className="w-full px-3 py-2 border rounded"
                placeholder="Monto por Punto"
                type="number"
                value={form.monto_por_punto}
                onChange={(e) =>
                  setForm({ ...form, monto_por_punto: e.target.value })
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
