// RUTA: src/pages/dashboard/DashboardCards.jsx
// --------------------------------------------------------------
// Cards KPI idénticas al diseño Figma:
// - Bordes redondeados XL
// - Sombras suaves
// - Fondo blanco
// - Iconos a la izquierda
// - Números grandes (text-3xl)
// --------------------------------------------------------------

export default function DashboardCards({ data }) {
  const items = [
    {
      label: "Total Clientes",
      value: data.total_clientes,
      icon: "👥",
      bg: "bg-white",
    },
    {
      label: "Puntos Asignados",
      value: data.puntos_asignados,
      icon: "🎁",
      bg: "bg-white",
    },
    {
      label: "Puntos Utilizados",
      value: data.puntos_usados,
      icon: "🔥",
      bg: "bg-white",
    },
    {
      label: "Puntos a Vencer (30 días)",
      value: data.bolsas_por_vencer,
      icon: "⏳",
      bg: "bg-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      {items.map((item) => (
        <div
          key={item.label}
          className={`${item.bg} p-5 rounded-lg shadow-card flex items-center gap-4`}
        >
          <div className="text-4xl">{item.icon}</div>

          <div>
            <p className="text-grayDark font-semibold">{item.label}</p>
            <p className="text-3xl font-bold text-figmaPrimary">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
