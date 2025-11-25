export default function Button({ children, onClick, type = "button", variant = "primary" }) {
  const base = "px-4 py-2 rounded font-semibold transition";
  const styles = {
    primary: "bg-primary text-white hover:bg-secondary",
    secondary: "bg-white border border-primary text-primary hover:bg-lightGray",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}
