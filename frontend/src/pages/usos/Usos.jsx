// RUTA: src/pages/usos/Usos.jsx
//-----------------------------------------------------------
// Módulo profesional para gestionar USOS DE PUNTOS
// Incluye:
// - CRUD de uso de puntos (cabecera)
// - Visualización del DETALLE FIFO
// - Botón para ejecutar "usar puntos" (servicio oficial)
//-----------------------------------------------------------

import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function Usos() {
  const [items, setItems] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [conceptos, setConceptos] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    cliente_id: "",
    concepto_id: "",
    puntos_utilizados: "",
    fecha: "",
  });

  // ------------------------------------------------------------
  // CARGAR DATA
  // ------------------------------------------------------------
  const cargar = () => {
    api.get(endpoints.usos).then((r) => setItems(r.data)).catch(console.error);
    api.get(endpoints.clientes).then((r) => setClientes(r.data)).catch(console.error);
    api.get(endpoints.conceptos).then((r) => setConceptos(r.data)).catch(console.error);
  };

  useEffect(() => cargar(), []);

  // ------------------------------------------------------------
  // CREAR
  // ------------------------------------------------------------
  const abrirCrear = () => {
    setEditMode(false);
    setForm({
      cliente_id: "",
      concepto_id: "",
      puntos_utilizados: "",
      fecha: "",
    });
    setModalOpen(true);
  };

  // ------------------------------------------------------------
  // EDITAR
  // ------------------------------------------------------------
  const abrirEditar = (item) => {
    setEditMode(true);
    setSelectedId(item.id);

    setForm({
      cliente_id: item.cliente.id,
      concepto_id: item.concepto.id,
      puntos_utilizados: item.puntos_utilizados,
      fecha: item.fecha.split("T")[0],
    });

    setModalOpen(true);
  };

  // ------------------------------------------------------------
  // GUARDAR (CREATE / UPDATE)
  // ------------------------------------------------------------
  const guardar = () => {
    if (editMode) {
      api
        .put(`${endpoints.usos}${selectedId}/`, form)
        .then(() => {
          cargar();
          setModalOpen(false);
        })
        .catch(console.error);
    } else {
      api
        .post(endpoints.usos, form)
        .then(() => {
          cargar();
          setModalOpen(false);
        })
        .catch(console.error);
    }
  };

  // ------------------------------------------------------------
  // ELIMINAR
  // ------------------------------------------------------------
  const eliminar = (id) => {
    if (!window.confirm("¿Eliminar registro de uso?")) return;
    api.delete(`${endpoints.usos}${id}/`).then(cargar).catch(console.error);
  };

  // ------------------------------------------------------------
  // USO REAL → Servicio oficial FIFO
  // ------------------------------------------------------------
  const ejecutarServicioUsarPuntos = async () => {
    const puntos = parseInt(form.puntos_utilizados);
    if (!form.cliente_id || !form.concepto_id || !puntos) {
      alert("Debe completar cliente, concepto y puntos.");
      return;
    }

    try {
      await api.post(endpoints.usar_puntos, {
        cliente_id: form.cliente_id,
        concepto_id: form.concepto_id,
        puntos_requeridos: puntos,
      });

      alert("Uso de puntos generado correctamente ✔");
      cargar();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error al usar puntos.");
    }
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Uso de Puntos</h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={abrirCrear}>
          + Nuevo Uso
        </button>
      </div>

      {/* TABLA */}
      <table className="min-w-full bg-white shadow rounded mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-3">ID</th>
            <th className="py-2 px-3">Cliente</th>
            <th className="py-2 px-3">Concepto</th>
            <th className="py-2 px-3">Puntos</th>
            <th className="py-2 px-3">Fecha</th>
            <th className="py-2 px-3">Detalle FIFO</th>
            <th className="py-2 px-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3">{u.id}</td>
              <td className="py-2 px-3">
                {u.cliente.nombre} {u.cliente.apellido}
              </td>
              <td className="py-2 px-3">{u.concepto.descripcion}</td>
              <td className="py-2 px-3">{u.puntos_utilizados}</td>
              <td className="py-2 px-3">{u.fecha}</td>

              {/* Detalle FIFO */}
              <td className="py-2 px-3">
                <ul className="text-sm text-gray-700">
                  {u.detalles.map((d) => (
                    <li key={d.id}>
                      Bolsa #{d.bolsa_id} – {d.puntos_utilizados} pts  
                      <span className="text-gray-500">
                        {" "} (vence {d.fecha_caducidad})
                      </span>
                    </li>
                  ))}
                </ul>
              </td>

              <td className="py-2 px-3 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => abrirEditar(u)}
                >
                  Editar
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => eliminar(u.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-[450px]">
            <h3 className="text-xl font-bold mb-3">
              {editMode ? "Editar Uso" : "Crear Uso / Servicio"}
            </h3>

            <div className="space-y-3">
              {/* CLIENTE */}
              <select
                className="w-full border px-3 py-2 rounded"
                value={form.cliente_id}
                onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
              >
                <option value="">Seleccione cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.apellido}
                  </option>
                ))}
              </select>

              {/* CONCEPTO */}
              <select
                className="w-full border px-3 py-2 rounded"
                value={form.concepto_id}
                onChange={(e) => setForm({ ...form, concepto_id: e.target.value })}
              >
                <option value="">Seleccione concepto</option>
                {conceptos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.descripcion} ({c.puntos_requeridos} pts)
                  </option>
                ))}
              </select>

              {/* PUNTOS */}
              <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                placeholder="Puntos a usar"
                value={form.puntos_utilizados}
                onChange={(e) =>
                  setForm({ ...form, puntos_utilizados: e.target.value })
                }
              />

              {/* FECHA */}
              <input
                type="date"
                className="w-full border px-3 py-2 rounded"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>

              {/* Botón servicio REAL FIFO */}
              {!editMode && (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  onClick={ejecutarServicioUsarPuntos}
                >
                  Usar Puntos (FIFO)
                </button>
              )}

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
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
