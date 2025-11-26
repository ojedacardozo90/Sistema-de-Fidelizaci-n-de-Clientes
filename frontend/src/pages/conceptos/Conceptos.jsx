// RUTA: src/pages/conceptos/Conceptos.jsx
// ============================================================
// Página de Conceptos — versión Figma (tabla + buscador + botón)
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Conceptos() {
  const [conceptos, setConceptos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarConceptos();
  }, []);

  const cargarConceptos = () => {
    api
      .get("/conceptos/")
      .then((res) => setConceptos(res.data.results || res.data))
      .catch(() => {});
  };

  // Filtrado por descripción (frontend)
  const conceptosFiltrados = conceptos.filter((c) =>
    c.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ============================================= */}
      {/* Título */}
      {/* ============================================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Conceptos</h1>

        <Link to="/conceptos/nuevo" className="figma-btn-primary">
          + Nuevo Concepto
        </Link>
      </div>

      {/* ============================================= */}
      {/* Buscador */}
      {/* ============================================= */}
      <div className="card p-4 flex gap-4 items-center">
        <input
          type="text"
          className="figma-input flex-1"
          placeholder="Buscar concepto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* ============================================= */}
      {/* Tabla */}
      {/* ============================================= */}
      <div className="card p-0 overflow-hidden">
        <table className="figma-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Puntos requeridos</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {conceptosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No hay conceptos registrados.
                </td>
              </tr>
            ) : (
              conceptosFiltrados.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.descripcion}</td>
                  <td>{c.puntos_requeridos}</td>
                  <td>
                    <Link
                      to={`/conceptos/editar/${c.id}`}
                      className="figma-btn-table"
                    >
                      Editar
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
