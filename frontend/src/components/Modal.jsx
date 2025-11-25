export default function Modal({ open, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-xl relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}
