// RUTA: src/pages/canje/CanjeProductos.jsx

import { useEffect, useState } from "react";
import api from "../../services/api";
import FigmaButton from "../../components/base/FigmaButton";
import FigmaModal from "../../components/base/FigmaModal";

export default function CanjeProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteId, setClienteId] = useState("");
  
  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    api.get("/productos_canje/")
      .then((res) => setProductos(res.data))
      .finally(() => setLoading(false));
  }, []);

  const abrirModal = (producto) => {
    if (!clienteId) {
      alert("Debe ingresar un ID de Cliente.");
      return;
    }
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  const confirmarCanje = async () => {
    try {
      const res = await api.post("/servicios/canjear_producto/", {
        cliente_id: clienteId,
        producto_id: productoSeleccionado.id,
      });

      alert(`✔ ${res.data.producto} canjeado exitosamente.`);
      setModalOpen(false);

    } catch (e) {
      alert("❌ Error: " + e.response?.data?.error);
    }
  };

  return (
    <div className="page-container animate-fadeIn">

      {/* TÍTULO */}
      <h1 className="page-title">Catálogo de Productos para Canje</h1>

      {/* CLIENTE */}
      <div className="card mb-6 p-4">
        <label className="figma-label">ID del Cliente</label>
        <input
          type="number"
          className="figma-input w-52"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          placeholder="Ingrese ID"
        />
      </div>

      {/* TABLA */}
      <div className="card">
        <h3 className="figma-card-title">Productos Disponibles</h3>

        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <table className="figma-table mt-4">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Puntos</th>
                <th>Descripción</th>
                <th>Canjear</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.puntos_requeridos}</td>
                  <td>{p.descripcion}</td>
                  <td>
                    <FigmaButton onClick={() => abrirModal(p)}>
                      Canjear
                    </FigmaButton>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>


      {/* ============================================ */}
      {/* MODAL DE CONFIRMACIÓN */}
      {/* ============================================ */}
      <FigmaModal
        open={modalOpen}
        title="Confirmar Canje"
        onClose={() => setModalOpen(false)}
      >
        {productoSeleccionado && (
          <div>
            <p className="text-gray-700 mb-4">
              ¿Desea canjear el producto:
              <strong> {productoSeleccionado.nombre}</strong>  
              por  
              <strong> {productoSeleccionado.puntos_requeridos} puntos</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarCanje}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </FigmaModal>

    </div>
  );
}
