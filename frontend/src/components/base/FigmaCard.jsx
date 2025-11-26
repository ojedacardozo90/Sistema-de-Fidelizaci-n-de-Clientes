// RUTA: src/components/base/FigmaStatCard.jsx
// -------------------------------------------
// Tarjeta de estadísticas EXACTA según Figma
// Props:
//  - title: "Clientes Activos"
//  - value: número
//  - color: "verde", "dark", "light"
// -------------------------------------------

export default function FigmaStatCard({ title, value, color = "green" }) {
  const colors = {
    green: "bg-primary",             // Verde Figma
    dark: "bg-primaryDark",          // Azul oscuro Figma
    light: "bg-green-300",           // Verde claro Figma (#86D19A aprox)
  };

  return (
    <div
      className={`
        ${colors[color]}
        rounded-xl shadow-card
        p-5
        flex flex-col justify-center
        text-white
        h-24
        min-w-[220px]
      `}
    >
      {/* Título */}
      <p className="text-xs text-gray-100 tracking-wide">
        {title}
      </p>

      {/* Valor */}
      <h2 className="text-3xl font-bold mt-1">
        {value}
      </h2>
    </div>
  );
}
