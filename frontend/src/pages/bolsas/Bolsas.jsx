// RUTA: src/pages/bolsas/Bolsas.jsx
// ============================================================
// Página: Bolsas de Puntos (versión Figma)
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";

export default function Bolsas() {
  const [bolsas, setBolsas] = useState([]);
  const [buscador, setBuscador] = useState("");
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");

  // Cargar bolsas
  const cargarDatos = () => {
    api.get("/api/bolsas/")
      .then((res) => setBolsas(res.data.results || res.data))
      .catch(() => console.log("Error al cargar bolsas"));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Filtrado local
  const filtrado = bolsas.filter((b) => {
    const cliente = `${b.cliente?.nombre} ${b.cliente?.apellido}`.toLowerCase();
    const matchTexto = cliente.includes(buscador.toLowerCase());

    const puntos = b.puntos_asignados || 0;
    const matchMin = minP ? puntos >= parseInt(minP) : true;
    const matchMax = maxP ? puntos <= parseInt(maxP) : true;

    return matchTexto && matchMin && matchMax;
  });

  return (
    <div className="animate-fadeIn">

      {/* Titulo */}
      <h1 className="page-title mb-6">Bolsas de Puntos</h1>

      {/* Barra superior */}
      <div className="flex items-center justify-between mb-6">

        {/* Buscador */}
        <div className="flex items-center gap-3">
          <FigmaInput
            placeholder="Buscar por cliente..."
            value={buscador}
            onChange={(e) => setBuscador(e.target.value)}
            style={{ width: "260px" }}
          />

          <FigmaInput
            placeholder="Mín. puntos"
            value={minP}
            onChange={(e) => setMinP(e.target.value)}
            style={{ width: "140px" }}
          />

          <FigmaInput
            placeholder="Máx. puntos"
            value={maxP}
            onChange={(e) => setMaxP(e.target.value)}
            style={{ width: "140px" }}
          />
        </div>

        {/* Botón Nuevo */}
        <Link to="/bolsas/nuevo" className="figma-btn-primary">
          + Nueva Bolsa
        </Link>
      </div>

      {/* Tabla */}
      <FigmaTable
        columns={[
          { label: "ID", field: "id" },
          { label: "Cliente", field: "cliente" },
          { label: "Asignados", field: "puntos_asignados" },
          { label: "Usados", field: "puntos_utilizados" },
          { label: "Saldo", field: "saldo" },
          { label: "Estado", field: "estado" },
          { label: "Acciones", field: "acciones" },
        ]}
        data={filtrado.map((b) => ({
          id: b.id,
          cliente: `${b.cliente?.nombre} ${b.cliente?.apellido}`,
          puntos_asignados: `${b.puntos_asignados} pts`,
          puntos_utilizados: `${b.puntos_utilizados} pts`,
          saldo: `${b.saldo} pts`,
          estado: (
            <span
              style={{
                color:
                  b.estado === "ACTIVO"
                    ? "#1D4ED8"
                    : b.estado === "AGOTADO"
                    ? "#DC2626"
                    : "#7C3AED",
                fontWeight: 600,
              }}
            >
              {b.estado}
            </span>
          ),
          acciones: (
            <Link
              to={`/bolsas/editar/${b.id}`}
              className="figma-btn-table"
            >
              Editar
            </Link>
          ),
        }))}
      />
    </div>
  );
}
