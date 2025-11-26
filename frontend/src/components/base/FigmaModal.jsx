// RUTA: src/components/base/FigmaModal.jsx
// Modal Figma — Simples, hermoso, responsivo

export default function FigmaModal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

      {/* CONTENEDOR */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">

        {/* TÍTULO */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          {title}
        </h2>

        {/* CONTENIDO */}
        <div className="mb-6 text-gray-700">
          {children}
        </div>

        {/* BOTÓN CERRAR */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
          >
            Cerrar
          </button>
        </div>

      </div>

    </div>
  );
}
