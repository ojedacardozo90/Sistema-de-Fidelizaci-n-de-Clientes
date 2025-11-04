export default function Table({ headers, rows }) {
  return (
    <table className="min-w-full bg-white shadow rounded">
      <thead>
        <tr className="bg-gray-100">
          {headers.map((h) => (
            <th key={h} className="py-2 px-4 text-left border-b">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b hover:bg-gray-50">
            {Object.values(row).map((val, j) => (
              <td key={j} className="py-2 px-4">{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
