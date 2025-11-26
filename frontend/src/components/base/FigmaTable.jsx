// RUTA: src/components/base/FigmaTable.jsx
// Tabla estilo Figma — Reutilizable en todo el sistema

export default function FigmaTable({ columns = [], data = [] }) {
  return (
    <div className="w-full overflow-auto rounded-lg shadow bg-white p-4">

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            {columns.map((col) => (
              <th
                key={col.field}
                className="px-4 py-2 text-sm font-semibold text-gray-600 border-b"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 transition">
                {columns.map((col) => (
                  <td
                    key={col.field}
                    className="px-4 py-2 text-sm text-gray-700"
                  >
                    {row[col.field]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-4 text-center text-gray-400"
              >
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>

      </table>

    </div>
  );
}
