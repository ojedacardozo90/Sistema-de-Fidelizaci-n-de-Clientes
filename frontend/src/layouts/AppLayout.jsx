// RUTA: src/layouts/AppLayout.jsx

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO */}
      <div className="flex flex-col flex-1">
        
        {/* NAVBAR SUPERIOR */}
        <Navbar />

        {/* CUERPO PRINCIPAL */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
