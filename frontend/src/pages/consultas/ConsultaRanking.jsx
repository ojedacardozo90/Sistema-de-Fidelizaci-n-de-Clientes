// RUTA: src/pages/consultas/ConsultaRanking.jsx
// =======================================================
// Consulta: Ranking de Clientes (TOP 5)
// =======================================================

import { useState, useEffect } from "react";
import api from "../../services/api";
import FigmaInput from "../../components/base/FigmaInput";
import FigmaTable from "../../components/base/FigmaTable";

export default function ConsultaRanking() {
  const [buscador, setBuscador] = useState("");
  const [data, setData] = useState([]);
  const [top5, setTop5] = useState([]);

  const cargar = () => {
    api.get("/api/consultas/ranking/")
      .then((res) => {
        setTop5(res.data.top || res.data.ranking || []);
        setData(res.data.top || res.data.ranking || []);
      });
  };

  useEffect(() => {
    cargar();
  }, []);

  // FILTRO LOCAL
  const filtrados = data.filter((c) =>
    c.cliente.toLowerCase().includes(buscador.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title mb-6">Ranking de Clientes</h1>

      {/* BUSCADOR */}
      <div className="mb-6 flex items-center justify-between">
        <FigmaInput
          placeholder="Buscar cliente..."
          value={buscador}
          onChange={(e) => setBuscador(e.target.value)}
          style={{ width: "260px" }}
        />

        <div className="text-sm text-gray-700 font-semibold">
          TOP 5 — Total: {top5.length}
        </div>
      </div>

      {/* TABLA */}
      <FigmaTable
        columns={["Cliente", "Puntos Utilizados"]}
        data={filtrados.map((c) => [
          c.cliente,
          `${c.puntos_utilizados} pts`,
        ])}
      />
    </div>
  );
}
