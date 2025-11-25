import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import Modal from "../../components/Modal";
import ClienteForm from "./ClienteForm";

export default function ClientesList() {
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // -------------------------------------------------------
  // CARGAR CLIENTES
  // -------------------------------------------------------
  const loadClientes = () => {
    api.get(endpoints.clientes)
      .then((res) => setClientes(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadClientes();
  }, []);

  // -------------------------------------------------------
  // ELIMINAR CLIENTE
  // -------------------------------------------------------
  const deleteCliente = (id) => {
    if (!confirm("¿Seguro que desea eliminar este cliente?")) return;

    api.delete(`${endpoints.clientes}${id}/`)
      .then(() => loadClientes())
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Clientes</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => { setEditing(null); setOpen(true); }}
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* TABLA */}
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-secondary text-white">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Nombre</th>
            <th className="py-2 px-4">Apellido</th>
            <th className="py-2 px-4">Documento</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clientes.map((c) => (
            <tr key={c.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{c.id}</td>
              <td className="py-2 px-4">{c.nombre}</td>
              <td className="py-2 px-4">{c.apellido}</td>
              <td className="py-2 px-4">{c.numero_documento}</td>
              <td className="py-2 px-4">{c.email}</td>
              <td className="py-2 px-4 space-x-3">
                <button
                  className="text-blue-600"
                  onClick={() => { setEditing(c); setOpen(true); }}
                >
                  Editar
                </button>
                <button
                  className="text-red-600"
                  onClick={() => deleteCliente(c.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ClienteForm
          cliente={editing}
          onSuccess={() => { setOpen(false); loadClientes(); }}
        />
      </Modal>
    </div>
  );
}
