// RUTA: src/pages/vencimientos/VencimientosList.jsx
// ============================================================
// Página de Parametrización de Vencimientos — estilo Figma
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function VencimientosList() {
  const [items, setItems] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarVencimientos();
  }, []);

  const cargarVencimientos = () => {
    api
      .get("/vencimientos/")
      .then((res) => setItems(res.data.results || res.data))
      .catch(() => {});
  };

  const filtrar = items.filter((v) => {
    const texto = busqueda.toLowerCase();
    return (
      v.fecha_inicio.toLowerCase().includes(texto) ||
      v.fecha_fin.toLowerCase().includes(texto) ||
      v.dias_duracion.toString().includes(texto)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ============================================= */}
      {/* Título */}
      {/* ============================================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Parametrización de Vencimientos
        </h1>

        <Link to="/vencimientos/nuevo" className="figma-btn-primary">
          + Nuevo Registro
        </Link>
      </div>

      {/* ============================================= */}
      {/* Buscador */}
      {/* ============================================= */}
      <div className="card p-4 flex gap-4 items-center">
        <input
          type="text"
          className="figma-input flex-1"
          placeholder="Buscar por fecha o duración..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* ============================================= */}
      {/* Tabla Figma */}
      {/* ============================================= */}
      <div className="card p-0 overflow-hidden">
        <table className="figma-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Días de duración</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtrar.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              filtrar.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.fecha_inicio}</td>
                  <td>{v.fecha_fin}</td>
                  <td>{v.dias_duracion}</td>

                  <td>
                    <Link
                      to={`/vencimientos/editar/${v.id}`}
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
