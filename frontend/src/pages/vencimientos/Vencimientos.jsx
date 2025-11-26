// RUTA: src/pages/vencimientos/Vencimientos.jsx
// CRUD Vencimientos — Estilo Figma

import { useEffect, useState } from "react";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";

import BasePage from "../../components/base/BasePage";
import FigmaTable from "../../components/base/FigmaTable";
import FigmaButton from "../../components/base/FigmaButton";
import Modal from "../../components/Modal";
import VencimientoForm from "./VencimientoForm";

export default function Vencimientos() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // CARGAR DATA
  const loadData = () => {
    api.get(endpoints.vencimientos)
      .then((res) => setItems(res.data))
      .catch(console.error);
  };

  useEffect(() => loadData(), []);

  // ELIMINAR
  const deleteItem = (id) => {
    if (!confirm("¿Eliminar este vencimiento?")) return;

    api.delete(`${endpoints.vencimientos}${id}/`)
      .then(loadData)
      .catch(console.error);
  };

  // TABLA
  const headers = [
    "ID",
    "Inicio de Validez",
    "Fin de Validez",
    "Días de Duración",
    "Acciones",
  ];

  const rows = items.map((v) => ({
    id: v.id,
    inicio: v.fecha_inicio_validez,
    fin: v.fecha_fin_validez,
    dias: v.dias_duracion,
    acciones: (
      <div className="flex gap-2">
        <button
          className="text-figmaPrimary font-semibold"
          onClick={() => { setEditing(v); setOpen(true); }}
        >
          Editar
        </button>

        <button
          className="text-danger font-semibold"
          onClick={() => deleteItem(v.id)}
        >
          Eliminar
        </button>
      </div>
    ),
  }));

  return (
    <BasePage title="Parametrización de Vencimientos">

      <div className="mb-4">
        <FigmaButton onClick={() => { setEditing(null); setOpen(true); }}>
          + Nuevo Vencimiento
        </FigmaButton>
      </div>

      <FigmaTable headers={headers} rows={rows} />

      <Modal open={open} onClose={() => setOpen(false)}>
        <VencimientoForm
          item={editing}
          onSuccess={() => {
            setOpen(false);
            loadData();
          }}
        />
      </Modal>
    </BasePage>
  );
}
