// RUTA: src/components/base/BasePage.jsx
// ----------------------------------------------------------
// Componente base para páginas estilo Figma:
// - Título grande
// - Card blanca con sombra
// ----------------------------------------------------------

export default function BasePage({ title, children }) {
  return (
    <div className="p-6">
      {/* TÍTULO PRINCIPAL */}
      <h1 className="text-3xl font-bold text-figmaPrimary mb-6">{title}</h1>

      {/* CARD CONTENEDOR */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        {children}
      </div>
    </div>
  );
}
