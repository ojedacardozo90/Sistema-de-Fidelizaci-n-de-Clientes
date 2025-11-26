// RUTA: src/pages/clientes/Clientes.jsx
// ============================================================
// Página de Clientes — versión Figma (tabla + buscador + botón)
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = () => {
    api.get("/clientes/")
      .then((res) => setClientes(res.data.results || res.data))
      .catch(() => {});
  };

  // Filtrado por nombre/apellido (Frontend)
  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.numero_documento.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ============================================= */}
      {/* TÍTULO */}
      {/* ============================================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Clientes
        </h1>

        <Link
          to="/clientes/nuevo"
          className="figma-btn-primary"
        >
          + Nuevo Cliente
        </Link>
      </div>

      {/* ============================================= */}
      {/* BUSCADOR */}
      {/* ============================================= */}
      <div className="card p-4 flex gap-4 items-center">
        <input
          type="text"
          className="figma-input flex-1"
          placeholder="Buscar por nombre, apellido o documento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* ============================================= */}
      {/* TABLA FIGMA */}
      {/* ============================================= */}
      <div className="card p-0 overflow-hidden">
        <table className="figma-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Documento</th>
              <th>Email</th>
              <th>Nacionalidad</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No se encontraron clientes.
                </td>
              </tr>
            ) : (
              clientesFiltrados.map((cli) => (
                <tr key={cli.id}>
                  <td>{cli.id}</td>
                  <td>{cli.nombre}</td>
                  <td>{cli.apellido}</td>
                  <td>{cli.numero_documento}</td>
                  <td>{cli.email || "-"}</td>
                  <td>{cli.nacionalidad}</td>

                  <td>
                    <Link
                      to={`/clientes/editar/${cli.id}`}
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
