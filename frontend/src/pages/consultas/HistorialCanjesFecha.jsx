HistorialCanjesFecha.jsx// RUTA: src/pages/consultas/HistorialCanjesFecha.jsx
// Figma Table — Historial de Canjes por Fecha

import { useState } from "react";
import api from "../../services/api";
import FigmaButton from "../../components/base/FigmaButton";

export default function HistorialCanjesFecha() {
  const [fecha, setFecha] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [historial, setHistorial] = useState([]);

  const buscar = async () => {
    try {
      let url = "/consultas/historial_canje_fecha/?";

      if (fecha) url += `fecha=${fecha}`;
      else if (inicio && fin) url += `fecha_inicio=${inicio}&fecha_fin=${fin}`;
      else {
        alert("Debe ingresar una fecha o un rango");
        return;
      }

      const res = await api.get(url);
      setHistorial(res.data);
    } catch {
      alert("Error consultando");
    }
  };

  return (
    <div className="page-container animate-fadeIn">

      <h1 className="page-title">Historial de Canjes por Fecha</h1>

      <div className="card p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <label className="figma-label">Fecha específica</label>
          <input type="date" className="figma-input" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>

        <div>
          <label className="figma-label">Fecha Inicio</label>
          <input type="date" className="figma-input" value={inicio} onChange={(e) => setInicio(e.target.value)} />
        </div>

        <div>
          <label className="figma-label">Fecha Fin</label>
          <input type="date" className="figma-input" value={fin} onChange={(e) => setFin(e.target.value)} />
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
              <th>Concepto</th>
              <th>Puntos</th>
              <th>Detalle FIFO</th>
            </tr>
          </thead>

          <tbody>
            {historial.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No hay resultados
                </td>
              </tr>
            ) : (
              historial.map((row, i) => (
                <tr key={i}>
                  <td>{row.cliente}</td>
                  <td>{new Date(row.fecha).toLocaleString()}</td>
                  <td>{row.concepto}</td>
                  <td>{row.puntos_utilizados}</td>
                  <td>
                    {row.detalles.map((d, j) => (
                      <div key={j}>Bolsa #{d.bolsa_id} → {d.puntos} pts</div>
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
