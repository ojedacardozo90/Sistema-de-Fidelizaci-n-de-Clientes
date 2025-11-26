// RUTA: src/components/base/FigmaButton.jsx
// Botón diseño Figma — PALETA A

export default function FigmaButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  full = false,
}) {
  return (
    <button
      className={`figma-button ${full ? "w-full" : ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
