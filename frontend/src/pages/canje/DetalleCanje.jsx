// RUTA: src/pages/canje/DetalleCanje.jsx
// Pantalla Figma — Detalle FIFO de un canje

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

export default function DetalleCanje() {
  const { id } = useParams();
  const [canje, setCanje] = useState(null);

  useEffect(() => {
    api.get(`/usos/${id}/`)
      .then((res) => setCanje(res.data))
      .catch(() => {});
  }, [id]);

  if (!canje) return <p>Cargando detalle...</p>;

  return (
    <div className="page-container animate-fadeIn">

      <h1 className="page-title">Detalle del Canje</h1>

      {/* CARD GENERAL */}
      <div className="figma-card mb-6">
        <h2 className="figma-card-title">Información general</h2>

        <p><strong>Cliente:</strong> {canje.cliente_nombre || canje.cliente}</p>
        <p><strong>Concepto:</strong> {canje.concepto_nombre || canje.concepto}</p>
        <p><strong>Puntos utilizados:</strong> {canje.puntos_utilizados}</p>
        <p><strong>Fecha:</strong> {new Date(canje.fecha).toLocaleString()}</p>
      </div>

      {/* TABLA FIFO */}
      <div className="figma-card">
        <h2 className="figma-card-title">Detalle FIFO</h2>

        <table className="figma-table mt-4">
          <thead>
            <tr>
              <th>ID Bolsa</th>
              <th>Fecha Asignación</th>
              <th>Puntos Asignados</th>
              <th>Puntos Usados</th>
            </tr>
          </thead>

          <tbody>
            {canje.detalles.map((d, i) => (
              <tr key={i}>
                <td>{d.bolsa}</td>
                <td>{new Date(d.bolsa_fecha_asignacion).toLocaleDateString()}</td>
                <td>{d.bolsa_puntos_asignados}</td>
                <td className="font-semibold text-blue-600">{d.puntos_utilizados}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      <Link
        to="/servicios/historial_canjes"
        className="figma-button mt-6 inline-block"
      >
        ← Volver al Historial
      </Link>

    </div>
  );
}
