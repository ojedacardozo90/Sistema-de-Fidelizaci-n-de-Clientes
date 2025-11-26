// RUTA: src/pages/usos/Usos.jsx
// ============================================================
// Página: Usos de Puntos (versión Figma)
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";

export default function Usos() {
  const [usos, setUsos] = useState([]);
  const [conceptos, setConceptos] = useState([]);

  const [buscarCliente, setBuscarCliente] = useState("");
  const [conceptoFiltro, setConceptoFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  // Cargar datos
  const cargarDatos = () => {
    api.get("/api/usos/")
      .then((res) => setUsos(res.data.results || res.data))
      .catch(() => console.log("Error al cargar usos"));

    api.get("/api/conceptos/")
      .then((res) => setConceptos(res.data.results || res.data))
      .catch(() => console.log("Error al cargar conceptos"));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Filtrar
  const filtrado = usos.filter((u) => {
    const clienteTxt = `${u.cliente?.nombre} ${u.cliente?.apellido}`.toLowerCase();
    const matchCliente = clienteTxt.includes(buscarCliente.toLowerCase());

    const matchConcepto = conceptoFiltro
      ? u.concepto?.id === parseInt(conceptoFiltro)
      : true;

    const matchFecha = fechaFiltro
      ? u.fecha.startsWith(fechaFiltro)
      : true;

    return matchCliente && matchConcepto && matchFecha;
  });

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Usos de Puntos</h1>

      {/* Barra superior */}
      <div className="flex items-center justify-between mb-6">

        {/* Filtros */}
        <div className="flex items-center gap-3">
          <FigmaInput
            placeholder="Buscar cliente..."
            value={buscarCliente}
            onChange={(e) => setBuscarCliente(e.target.value)}
            style={{ width: "240px" }}
          />

          {/* Concepto */}
          <select
            value={conceptoFiltro}
            onChange={(e) => setConceptoFiltro(e.target.value)}
            className="figma-select"
          >
            <option value="">Todos los conceptos</option>
            {conceptos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.descripcion}
              </option>
            ))}
          </select>

          {/* Fecha */}
          <input
            type="date"
            className="figma-input"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>

        {/* Registrar uso */}
        <Link to="/servicios/usar_puntos" className="figma-btn-primary">
          + Registrar Uso
        </Link>
      </div>

      {/* TABLA Figma */}
      <FigmaTable
        columns={[
          { label: "Cliente", field: "cliente" },
          { label: "Concepto", field: "concepto" },
          { label: "Puntos Usados", field: "puntos" },
          { label: "Fecha", field: "fecha" },
          { label: "Acciones", field: "acciones" },
        ]}
        data={filtrado.map((u) => ({
          cliente: `${u.cliente.nombre} ${u.cliente.apellido}`,
          concepto: u.concepto.descripcion,
          puntos: `${u.puntos_utilizados} pts`,
          fecha: new Date(u.fecha).toLocaleString(),

          acciones: (
            <Link
              to={`/usos/${u.id}`}
              className="figma-btn-table"
            >
              Ver detalle
            </Link>
          ),
        }))}
      />
    </div>
  );
}
