// RUTA: src/pages/bolsa/Bolsas.jsx
//-----------------------------------------------------------
// CRUD COMPLETO PARA BOLSAS DE PUNTOS
// Compatible con Django REST Framework
// Usa cliente_id para creación/edición
//-----------------------------------------------------------

import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function Bolsas() {
  const [items, setItems] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    cliente_id: "",
    puntos_asignados: "",
    puntos_utilizados: 0,
    monto_operacion: "",
    fecha_asignacion: "",
    fecha_caducidad: "",
    estado: "ACTIVO",
  });

  // ------------------------------------------------------------
  // Cargar datos
  // ------------------------------------------------------------
  const cargar = () => {
    api
      .get(endpoints.bolsas)
      .then((res) => setItems(res.data))
      .catch(console.error);

    api
      .get(endpoints.clientes)
      .then((res) => setClientes(res.data))
      .catch(console.error);
  };

  useEffect(() => cargar(), []);

  // ------------------------------------------------------------
  // Abrir modal de CREAR
  // ------------------------------------------------------------
  const abrirCrear = () => {
    setEditMode(false);
    setForm({
      cliente_id: "",
      puntos_asignados: "",
      puntos_utilizados: 0,
      monto_operacion: "",
      fecha_asignacion: "",
      fecha_caducidad: "",
      estado: "ACTIVO",
    });
    setModalOpen(true);
  };

  // ------------------------------------------------------------
  // Abrir modal de EDITAR
  // ------------------------------------------------------------
  const abrirEditar = (item) => {
    setEditMode(true);
    setSelectedId(item.id);

    setForm({
      cliente_id: item.cliente.id,
      puntos_asignados: item.puntos_asignados,
      puntos_utilizados: item.puntos_utilizados,
      monto_operacion: item.monto_operacion,
      fecha_asignacion: item.fecha_asignacion.split("T")[0],
      fecha_caducidad: item.fecha_caducidad.split("T")[0],
      estado: item.estado,
    });

    setModalOpen(true);
  };

  // ------------------------------------------------------------
  // Guardar (CREATE / UPDATE)
  // ------------------------------------------------------------
  const guardar = () => {
    if (editMode) {
      api
        .put(`${endpoints.bolsas}${selectedId}/`, form)
        .then(() => {
          cargar();
          setModalOpen(false);
        })
        .catch(console.error);
    } else {
      api
        .post(endpoints.bolsas, form)
        .then(() => {
          cargar();
          setModalOpen(false);
        })
        .catch(console.error);
    }
  };

  // ------------------------------------------------------------
  // Eliminar
  // ------------------------------------------------------------
  const eliminar = (id) => {
    if (!window.confirm("¿Eliminar la bolsa?")) return;

    api
      .delete(`${endpoints.bolsas}${id}/`)
      .then(cargar)
      .catch(console.error);
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Bolsas de Puntos</h2>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={abrirCrear}
        >
          + Nueva Bolsa
        </button>
      </div>

      {/* TABLA */}
      <table className="min-w-full bg-white shadow rounded mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Cliente</th>
            <th className="py-2 px-4">Asignados</th>
            <th className="py-2 px-4">Usados</th>
            <th className="py-2 px-4">Saldo</th>
            <th className="py-2 px-4">Monto</th>
            <th className="py-2 px-4">F. Asignación</th>
            <th className="py-2 px-4">F. Caducidad</th>
            <th className="py-2 px-4">Estado</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map((b) => (
            <tr key={b.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{b.id}</td>
              <td className="py-2 px-4">{b.cliente.nombre} {b.cliente.apellido}</td>
              <td className="py-2 px-4">{b.puntos_asignados}</td>
              <td className="py-2 px-4">{b.puntos_utilizados}</td>
              <td className="py-2 px-4">{b.saldo}</td>
              <td className="py-2 px-4">{b.monto_operacion}</td>
              <td className="py-2 px-4">{b.fecha_asignacion}</td>
              <td className="py-2 px-4">{b.fecha_caducidad}</td>
              <td className="py-2 px-4">{b.estado}</td>

              <td className="py-2 px-4 flex gap-2">
                <button
                  className="bg-yellow-500 px-3 py-1 rounded text-white"
                  onClick={() => abrirEditar(b)}
                >
                  Editar
                </button>

                <button
                  className="bg-red-600 px-3 py-1 rounded text-white"
                  onClick={() => eliminar(b.id)}
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
          <div className="bg-white rounded p-6 w-[450px] shadow-lg">
            <h3 className="text-xl font-semibold mb-3">
              {editMode ? "Editar Bolsa" : "Nueva Bolsa"}
            </h3>

            <div className="space-y-3">

              {/* CLIENTE */}
              <select
                className="w-full px-3 py-2 border rounded"
                value={form.cliente_id}
                onChange={(e) =>
                  setForm({ ...form, cliente_id: e.target.value })
                }
              >
                <option value="">Seleccione cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.apellido}
                  </option>
                ))}
              </select>

              {/* PUNTOS ASIGNADOS */}
              <input
                className="w-full px-3 py-2 border rounded"
                type="number"
                placeholder="Puntos asignados"
                value={form.puntos_asignados}
                onChange={(e) =>
                  setForm({ ...form, puntos_asignados: e.target.value })
                }
              />

              {/* PUNTOS UTILIZADOS */}
              <input
                className="w-full px-3 py-2 border rounded"
                type="number"
                placeholder="Puntos utilizados"
                value={form.puntos_utilizados}
                onChange={(e) =>
                  setForm({ ...form, puntos_utilizados: e.target.value })
                }
              />

              {/* MONTO */}
              <input
                className="w-full px-3 py-2 border rounded"
                type="number"
                placeholder="Monto operación"
                value={form.monto_operacion}
                onChange={(e) =>
                  setForm({ ...form, monto_operacion: e.target.value })
                }
              />

              {/* FECHAS */}
              <input
                className="w-full px-3 py-2 border rounded"
                type="date"
                value={form.fecha_asignacion}
                onChange={(e) =>
                  setForm({ ...form, fecha_asignacion: e.target.value })
                }
              />

              <input
                className="w-full px-3 py-2 border rounded"
                type="date"
                value={form.fecha_caducidad}
                onChange={(e) =>
                  setForm({ ...form, fecha_caducidad: e.target.value })
                }
              />

              {/* ESTADO */}
              <select
                className="w-full px-3 py-2 border rounded"
                value={form.estado}
                onChange={(e) =>
                  setForm({ ...form, estado: e.target.value })
                }
              >
                <option value="ACTIVO">Activo</option>
                <option value="AGOTADO">Agotado</option>
                <option value="VENCIDO">Vencido</option>
              </select>
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
