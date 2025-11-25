/**
 * RankingReport.jsx
 * -----------------------------------------------------------
 * Muestra el ranking de clientes según puntos utilizados.
 * Consume:
 *  GET /api/consultas/ranking/
 * -----------------------------------------------------------
 */

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function RankingReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(endpoints.ranking)
      .then((res) => setData(res.data.top))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        Ranking de Clientes
      </h2>

      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="py-2 px-4">Cliente</th>
            <th className="py-2 px-4">Puntos Utilizados</th>
          </tr>
        </thead>

        <tbody>
          {data.map((r, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{r.cliente}</td>
              <td className="py-2 px-4 font-bold">{r.puntos_utilizados}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
