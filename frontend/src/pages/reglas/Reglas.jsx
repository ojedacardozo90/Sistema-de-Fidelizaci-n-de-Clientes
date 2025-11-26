// RUTA: src/pages/reglas/Reglas.jsx
// ============================================================
// Página de Reglas de Asignación — estilo Figma
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Reglas() {
  const [reglas, setReglas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarReglas();
  }, []);

  const cargarReglas = () => {
    api
      .get("/reglas/")
      .then((res) => setReglas(res.data.results || res.data))
      .catch(() => {});
  };

  // FILTRO por monto/limites (frontend)
  const reglasFiltradas = reglas.filter((r) => {
    const texto = busqueda.toLowerCase();

    return (
      r.limite_inferior.toString().includes(texto) ||
      (r.limite_superior && r.limite_superior.toString().includes(texto)) ||
      r.monto_por_punto.toString().includes(texto)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* TÍTULO */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Reglas de Asignación</h1>

        <Link to="/reglas/nuevo" className="figma-btn-primary">
          + Nueva Regla
        </Link>
      </div>

      {/* BUSCADOR */}
      <div className="card p-4 flex gap-4 items-center">
        <input
          type="text"
          className="figma-input flex-1"
          placeholder="Buscar por límite o monto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <div className="card p-0 overflow-hidden">
        <table className="figma-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Límite inferior</th>
              <th>Límite superior</th>
              <th>Monto por punto</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {reglasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No se encontraron reglas.
                </td>
              </tr>
            ) : (
              reglasFiltradas.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.limite_inferior}</td>
                  <td>{r.limite_superior ?? "–"}</td>
                  <td>{r.monto_por_punto}</td>

                  <td>
                    <Link
                      to={`/reglas/editar/${r.id}`}
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
