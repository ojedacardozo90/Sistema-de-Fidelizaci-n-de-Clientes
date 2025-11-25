// RUTA: src/pages/clientes/Clientes.jsx
//-----------------------------------------------------------
// CRUD COMPLETO DE CLIENTES
// Incluye:
// - Tabla
// - Crear cliente (modal)
// - Editar cliente (modal)
// - Eliminar
// Compatible con tu backend
//-----------------------------------------------------------

import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

export default function Clientes() {
  // ======================================================
  // Estados principales
  // ======================================================
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

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

  const [selectedId, setSelectedId] = useState(null);

  // ======================================================
  // Cargar datos iniciales
  // ======================================================
  const cargarClientes = () => {
    api
      .get(endpoints.clientes)
      .then((res) => {
        console.log("CLIENTES => ", res.data);
        setClientes(res.data?.results ?? []); // ← FIX NECESARIO
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // ======================================================
  // Abrir modal para crear
  // ======================================================
  const abrirCrear = () => {
    setEditMode(false);
    setForm({
      nombre: "",
      apellido: "",
      numero_documento: "",
      tipo_documento: "CI",
      nacionalidad: "Paraguaya",
      email: "",
      telefono: "",
      fecha_nacimiento: "",
    });
    setModalOpen(true);
  };

  // ======================================================
  // Abrir modal para editar
  // ======================================================
  const abrirEditar = (cliente) => {
    setEditMode(true);
    setSelectedId(cliente.id);
    setForm(cliente);
    setModalOpen(true);
  };

  // ======================================================
  // Guardar nuevo o actualizar
  // ======================================================
  const guardarCliente = () => {
    if (editMode) {
      // EDITAR
      api
        .put(`${endpoints.clientes}${selectedId}/`, form)
        .then(() => {
          cargarClientes();
          setModalOpen(false);
        })
        .catch((err) => console.error(err));
    } else {
      // CREAR
      api
        .post(endpoints.clientes, form)
        .then(() => {
          cargarClientes();
          setModalOpen(false);
        })
        .catch((err) => console.error(err));
    }
  };

  // ======================================================
  // Eliminar
  // ======================================================
  const eliminarCliente = (id) => {
    if (!window.confirm("¿Seguro que desea eliminar este cliente?")) return;

    api
      .delete(`${endpoints.clientes}${id}/`)
      .then(() => cargarClientes())
      .catch((err) => console.error(err));
  };

  // ======================================================
  // HTML
  // ======================================================
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Clientes</h2>
        <button
          onClick={abrirCrear}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* ======================================================
          TABLA
      ====================================================== */}
      <table className="min-w-full bg-white shadow rounded mt-4">
        <thead className="bg-gray-100">
          <tr>
            {[
              "ID",
              "Nombre",
              "Apellido",
              "Documento",
              "Nacionalidad",
              "Email",
              "Acciones",
            ].map((h) => (
              <th className="py-2 px-4 border-b text-left" key={h}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 border-b">
              <td className="py-2 px-4">{c.id}</td>
              <td className="py-2 px-4">{c.nombre}</td>
              <td className="py-2 px-4">{c.apellido}</td>
              <td className="py-2 px-4">{c.numero_documento}</td>
              <td className="py-2 px-4">{c.nacionalidad}</td>
              <td className="py-2 px-4">{c.email}</td>

              <td className="py-2 px-4 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => abrirEditar(c)}
                >
                  Editar
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => eliminarCliente(c.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ======================================================
          MODAL CREAR / EDITAR
      ====================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              {editMode ? "Editar Cliente" : "Nuevo Cliente"}
            </h3>

            {/* FORMULARIO */}
            <div className="space-y-3">
              {Object.keys(form).map((campo) => (
                <input
                  key={campo}
                  type={campo === "fecha_nacimiento" ? "date" : "text"}
                  placeholder={campo.replace("_", " ")}
                  value={form[campo] || ""}
                  onChange={(e) =>
                    setForm({ ...form, [campo]: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              ))}
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={guardarCliente}
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
