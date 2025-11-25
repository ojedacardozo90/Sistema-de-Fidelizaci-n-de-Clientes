// RUTA: src/layouts/components/Navbar.jsx

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow p-4 flex justify-end">

      <div className="flex items-center gap-3">
        <span className="text-gray-600">👤 Usuario</span>

        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Salir
        </button>
      </div>

    </header>
  );
}
