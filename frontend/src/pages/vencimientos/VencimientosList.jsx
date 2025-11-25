import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import Modal from "../../components/Modal";
import VencimientoForm from "./VencimientoForm";

export default function VencimientosList() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadData = () => {
    api.get(endpoints.vencimientos)
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => { loadData(); }, []);

  const deleteItem = (id) => {
    if (!confirm("¿Desea eliminar esta parametrización?")) return;

    api.delete(`${endpoints.vencimientos}${id}/`)
      .then(() => loadData())
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Parametrización de Vencimientos</h2>

        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => { setEditing(null); setOpen(true); }}
        >
          + Nueva Parametrización
        </button>
      </div>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-secondary text-white">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Fecha Inicio</th>
            <th className="py-2 px-4">Fecha Fin</th>
            <th className="py-2 px-4">Días Duración</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map((v) => (
            <tr key={v.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{v.id}</td>
              <td className="py-2 px-4">{v.fecha_inicio}</td>
              <td className="py-2 px-4">{v.fecha_fin}</td>
              <td className="py-2 px-4">{v.dias_duracion}</td>

              <td className="py-2 px-4 space-x-3">
                <button
                  className="text-blue-600"
                  onClick={() => { setEditing(v); setOpen(true); }}
                >
                  Editar
                </button>

                <button
                  className="text-red-600"
                  onClick={() => deleteItem(v.id)}
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
        <VencimientoForm
          item={editing}
          onSuccess={() => { setOpen(false); loadData(); }}
        />
      </Modal>
    </div>
  );
}
