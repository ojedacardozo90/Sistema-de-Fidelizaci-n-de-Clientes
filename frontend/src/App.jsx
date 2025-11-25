// RUTA: src/App.jsx
// ============================================================
// NAVEGACIÓN PRINCIPAL DEL SISTEMA DE FIDELIZACIÓN
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AppLayout from "./layouts/AppLayout";

// ----- AUTH -----
import Login from "./pages/auth/Login";

// ----- Dashboard -----
import Dashboard from "./pages/dashboard/Dashboard";

// ----- CRUDs -----
import Clientes from "./pages/clientes/Clientes";
import ClienteNuevo from "./pages/clientes/ClienteNuevo";

import Conceptos from "./pages/conceptos/Conceptos";
import Reglas from "./pages/reglas/Reglas";
import VencimientosList from "./pages/vencimientos/VencimientosList";
import Bolsas from "./pages/bolsa/Bolsas";
import Usos from "./pages/usos/Usos";

// ----- Servicios -----
import CargarPuntos from "./pages/servicios/CargarPuntos";
import UsarPuntos from "./pages/servicios/UsarPuntos";

// ----- Reportes -----
import {
  ReportesDashboard,
  RankingReport,
  PuntosVencerReport,
  UsosFiltrosReport,
  BolsasRangoReport,
} from "./pages/reportes";

export default function App() {

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuth(true);
  }, []);

  // ==============================
  // RUTA PÚBLICA → LOGIN
  // ==============================
  if (!auth) {
    return <Login onLogin={() =>window.location.reload()} />
  }

  // ==============================
  // RUTAS PRIVADAS → BAJO AppLayout
  // ==============================
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>

          {/* DASHBOARD */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* CRUDS */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/nuevo" element={<ClienteNuevo />} />

          <Route path="/conceptos" element={<Conceptos />} />
          <Route path="/reglas" element={<Reglas />} />
          <Route path="/vencimientos" element={<VencimientosList />} />
          <Route path="/bolsas" element={<Bolsas />} />
          <Route path="/usos" element={<Usos />} />

          {/* SERVICIOS */}
          <Route path="/servicios/cargar_puntos" element={<CargarPuntos />} />
          <Route path="/servicios/usar_puntos" element={<UsarPuntos />} />


          {/* REPORTES */}
          <Route path="/reportes" element={<ReportesDashboard />} />
          <Route path="/reportes/ranking" element={<RankingReport />} />
          <Route path="/reportes/puntos_vencer" element={<PuntosVencerReport />} />
          <Route path="/reportes/usos_filtros" element={<UsosFiltrosReport />} />
          <Route path="/reportes/bolsas_rango" element={<BolsasRangoReport />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
