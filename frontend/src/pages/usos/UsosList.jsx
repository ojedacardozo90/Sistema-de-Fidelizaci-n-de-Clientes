import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import Modal from "../../components/Modal";
import UsoForm from "./UsosForm";
import UsoDetalle from "./UsosDetalle";

export default function UsosList() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [detalle, setDetalle] = useState(null);

  const loadData = () => {
    api.get(endpoints.usos)
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Uso de Puntos</h2>

        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setOpen(true)}
        >
          + Nuevo Canje
        </button>
      </div>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-secondary text-white">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Cliente</th>
            <th className="py-2 px-4">Concepto</th>
            <th className="py-2 px-4">Puntos Usados</th>
            <th className="py-2 px-4">Fecha</th>
            <th className="py-2 px-4">Detalle FIFO</th>
          </tr>
        </thead>

        <tbody>
          {items.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{u.id}</td>
              <td className="py-2 px-4">{u.cliente?.nombre} {u.cliente?.apellido}</td>
              <td className="py-2 px-4">{u.concepto?.descripcion}</td>
              <td className="py-2 px-4 font-bold">{u.puntos_utilizados}</td>
              <td className="py-2 px-4">{u.fecha?.slice(0, 10)}</td>

              <td className="py-2 px-4">
                <button
                  className="text-blue-600"
                  onClick={() => setDetalle(u)}
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL CANJE */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <UsoForm
          onSuccess={() => { setOpen(false); loadData(); }}
        />
      </Modal>

      {/* MODAL DETALLE */}
      <Modal open={!!detalle} onClose={() => setDetalle(null)}>
        {detalle && <UsoDetalle uso={detalle} />}
      </Modal>
    </div>
  );
}
