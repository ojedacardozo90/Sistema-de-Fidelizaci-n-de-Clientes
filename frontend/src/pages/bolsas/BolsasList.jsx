import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import Modal from "../../components/Modal";
import BolsaForm from "./BolsaForm";

export default function BolsasList() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadData = () => {
    api.get(endpoints.bolsas)
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => { loadData(); }, []);

  const deleteItem = (id) => {
    if (!confirm("¿Desea eliminar esta bolsa?")) return;

    api.delete(`${endpoints.bolsas}${id}/`)
      .then(() => loadData())
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Bolsas de Puntos</h2>

        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => { setEditing(null); setOpen(true); }}
        >
          + Nueva Bolsa
        </button>
      </div>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-secondary text-white">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Cliente</th>
            <th className="py-2 px-4">Asignación</th>
            <th className="py-2 px-4">Caducidad</th>
            <th className="py-2 px-4">Puntos</th>
            <th className="py-2 px-4">Usados</th>
            <th className="py-2 px-4">Saldo</th>
            <th className="py-2 px-4">Estado</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map((b) => (
            <tr key={b.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{b.id}</td>
              <td className="py-2 px-4">
                {b.cliente?.nombre} {b.cliente?.apellido}
              </td>
              <td className="py-2 px-4">{b.fecha_asignacion?.slice(0, 10)}</td>
              <td className="py-2 px-4">{b.fecha_caducidad?.slice(0, 10)}</td>
              <td className="py-2 px-4">{b.puntos_asignados}</td>
              <td className="py-2 px-4">{b.puntos_utilizados}</td>
              <td className="py-2 px-4 font-bold">{b.saldo}</td>

              <td className="py-2 px-4">
                <span
                  className={
                    b.estado === "ACTIVO"
                      ? "text-green-600 font-bold"
                      : b.estado === "AGOTADO"
                      ? "text-orange-500 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {b.estado}
                </span>
              </td>

              <td className="py-2 px-4 space-x-3">
                <button
                  className="text-blue-600"
                  onClick={() => { setEditing(b); setOpen(true); }}
                >
                  Editar
                </button>

                <button
                  className="text-red-600"
                  onClick={() => deleteItem(b.id)}
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
        <BolsaForm
          item={editing}
          onSuccess={() => { setOpen(false); loadData(); }}
        />
      </Modal>
    </div>
  );
}
