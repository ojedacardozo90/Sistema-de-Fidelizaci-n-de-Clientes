// RUTA: src/pages/consultas/HistorialCanjesProducto.jsx
// Historial de Canjes filtrado por Concepto — Tabla Figma

import { useState, useEffect } from "react";
import api from "../../services/api";
import FigmaButton from "../../components/base/FigmaButton";
import FigmaInput from "../../components/base/FigmaInput";

export default function HistorialCanjesProducto() {
  const [conceptos, setConceptos] = useState([]);
  const [concepto, setConcepto] = useState("");
  const [historial, setHistorial] = useState([]);

  // Cargar lista de conceptos al cargar la página
  useEffect(() => {
    api.get("/conceptos/")
      .then((res) => setConceptos(res.data))
      .catch(() => {});
  }, []);

  const buscar = async () => {
    if (!concepto) {
      alert("Debe seleccionar un concepto");
      return;
    }

    try {
      const res = await api.get(`/consultas/historial_canje_producto/?concepto_id=${concepto}`);
      setHistorial(res.data);
    } catch (e) {
      alert("Error consultando historial");
    }
  };

  return (
    <div className="page-container animate-fadeIn">

      <h1 className="page-title">Historial de Canjes por Producto</h1>

      {/* FILTRO */}
      <div className="card p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <label className="figma-label">Seleccione un Concepto</label>
          <select
            className="figma-select"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {conceptos.map((c) => (
              <option key={c.id} value={c.id}>{c.descripcion}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <FigmaButton onClick={buscar}>Buscar</FigmaButton>
        </div>
      </div>

      {/* TABLA */}
      <div className="card mt-6">
        <h3 className="figma-card-title">Resultados</h3>

        <table className="figma-table mt-4">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Puntos Utilizados</th>
              <th>Detalle FIFO</th>
            </tr>
          </thead>

          <tbody>
            {historial.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No hay resultados
                </td>
              </tr>
            ) : (
              historial.map((row, i) => (
                <tr key={i}>
                  <td>{row.cliente}</td>
                  <td>{new Date(row.fecha).toLocaleString()}</td>
                  <td>{row.puntos_utilizados}</td>
                  <td>
                    {row.detalles.map((d, j) => (
                      <div key={j}>
                        Bolsa #{d.bolsa_id} → {d.puntos} pts
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
