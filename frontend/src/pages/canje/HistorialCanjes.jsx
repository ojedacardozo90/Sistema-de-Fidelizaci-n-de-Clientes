// RUTA: src/pages/canje/HistorialCanjes.jsx
// Historial de Canjes — Diseño Figma + Botón "Ver Detalle"

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function HistorialCanjes() {
  const [canjes, setCanjes] = useState([]);

  useEffect(() => {
    api.get("/usos/")
      .then((res) => setCanjes(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="page-container animate-fadeIn">

      {/* TÍTULO */}
      <h1 className="page-title">Historial de Canjes</h1>

      {/* TABLA */}
      <div className="figma-card">
        <h3 className="figma-card-title">Listado de Canjes</h3>

        <table className="figma-table mt-4">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Concepto / Producto</th>
              <th>Puntos Usados</th>
              <th>Fecha</th>
              <th>Detalle</th>
            </tr>
          </thead>

          <tbody>
            {canjes.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-600">
                  No hay canjes registrados
                </td>
              </tr>
            ) : (
              canjes.map((c) => (
                <tr key={c.id}>
                  <td>{c.cliente_nombre || c.cliente}</td>
                  <td>{c.concepto_nombre || c.concepto}</td>
                  <td>{c.puntos_utilizados}</td>
                  <td>{new Date(c.fecha).toLocaleString()}</td>

                  {/* BOTÓN DE DETALLE */}
                  <td>
                    <Link
                      to={`/servicios/canje_detalle/${c.id}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Ver detalle
                    </Link>
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
