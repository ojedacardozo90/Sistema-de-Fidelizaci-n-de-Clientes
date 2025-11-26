// RUTA: src/pages/dashboard/DashboardRanking.jsx
// --------------------------------------------------------------
// Tabla ranking (Top 5) igual al PDF Figma:
// - Fondo blanco
// - Bordes suaves
// - Filas grises al hover
// --------------------------------------------------------------

export default function DashboardRanking({ ranking }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-card">
      <h3 className="text-xl font-bold text-figmaPrimary mb-4">
        Ranking de Clientes (Top 5)
      </h3>

      <table className="min-w-full">
        <thead>
          <tr className="bg-grayLight text-grayDark">
            <th className="p-2">Cliente</th>
            <th className="p-2">Puntos Usados</th>
          </tr>
        </thead>

        <tbody>
          {ranking.map((r, index) => (
            <tr key={index} className="border-b hover:bg-grayLight/50">
              <td className="p-2">{r.cliente}</td>
              <td className="p-2 font-bold text-figmaPrimary">{r.puntos_utilizados}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
