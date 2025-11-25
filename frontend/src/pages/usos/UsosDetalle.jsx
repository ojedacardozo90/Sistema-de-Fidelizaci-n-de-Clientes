export default function UsoDetalle({ uso }) {
  return (
    <div className="w-[460px] space-y-4">
      <h2 className="text-xl font-bold text-primary">Detalle FIFO del Uso</h2>

      <div className="p-3 bg-gray-100 rounded">
        <p><strong>Cliente:</strong> {uso.cliente?.nombre} {uso.cliente?.apellido}</p>
        <p><strong>Concepto:</strong> {uso.concepto?.descripcion}</p>
        <p><strong>Total usado:</strong> {uso.puntos_utilizados} pts</p>
      </div>

      <h3 className="text-lg font-semibold">Bolsas afectadas</h3>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-secondary text-white">
            <th className="py-2 px-4">Bolsa</th>
            <th className="py-2 px-4">Asignación</th>
            <th className="py-2 px-4">Caducidad</th>
            <th className="py-2 px-4">Usado</th>
          </tr>
        </thead>

        <tbody>
          {uso.detalles?.map((d) => (
            <tr key={d.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{d.bolsa?.id}</td>
              <td className="py-2 px-4">{d.bolsa?.fecha_asignacion?.slice(0,10)}</td>
              <td className="py-2 px-4">{d.bolsa?.fecha_caducidad?.slice(0,10)}</td>
              <td className="py-2 px-4 font-bold">{d.puntos_utilizados}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
