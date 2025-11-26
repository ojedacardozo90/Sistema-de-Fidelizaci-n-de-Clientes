// RUTA: src/layouts/AppLayout.jsx
// Layout principal del sistema — Sidebar A + Topbar Figma

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children, onLogout }) {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex flex-col flex-1">

        {/* TOPBAR (RECIBE onLogout) */}
        <Topbar onLogout={onLogout} />

        {/* CONTENIDO */}
        <main className="p-6 overflow-auto animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
}
