// RUTA: src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AppLayout from "./layouts/AppLayout";
import Login from "./pages/auth/Login";

import Dashboard from "./pages/dashboard/Dashboard";
import DashboardAnalytics from "./pages/dashboard/DashboardAnalytics";

// (todos tus imports exactamente igual)
import Clientes from "./pages/clientes/Clientes";
import ClienteForm from "./pages/clientes/ClienteForm";
import Conceptos from "./pages/conceptos/Conceptos";
import ConceptoForm from "./pages/conceptos/ConceptoForm";
import Reglas from "./pages/reglas/Reglas";
import ReglaForm from "./pages/reglas/ReglaForm";
import VencimientosList from "./pages/vencimientos/VencimientosList";
import Bolsas from "./pages/bolsas/Bolsas";
import BolsaForm from "./pages/bolsas/BolsaForm";
import Usos from "./pages/usos/Usos";
import CargarPuntos from "./pages/servicios/CargarPuntos";
import UsarPuntos from "./pages/servicios/UsarPuntos";
import CanjeProductos from "./pages/canje/CanjeProductos";
import HistorialCanjes from "./pages/canje/HistorialCanjes";
import DetalleCanje from "./pages/canje/DetalleCanje";

// CONSULTAS
import ConsultaClientes from "./pages/consultas/ConsultaClientes";
import ConsultaBolsasCliente from "./pages/consultas/ConsultaBolsasCliente";
import ConsultaBolsasRango from "./pages/consultas/ConsultaBolsasRango";
import ConsultaPuntosVencer from "./pages/consultas/ConsultaPuntosVencer";
import ConsultaRanking from "./pages/consultas/ConsultaRanking";
import ConsultaUsosConcepto from "./pages/consultas/ConsultaUsosConcepto";
import ConsultaUsosFecha from "./pages/consultas/ConsultaUsosFecha";
import ConsultaUsosCliente from "./pages/consultas/ConsultaUsosCliente";
import ConsultaCumpleanieros from "./pages/consultas/ConsultaCumpleanieros";
import ConsultaUsosRangoFecha from "./pages/consultas/ConsultaUsosRangoFecha";
import ConsultaUsosPorCliente from "./pages/consultas/ConsultaUsosPorCliente";
import ConsultaClientesApellido from "./pages/consultas/ConsultaClientesApellido";
import ConsultaClientesNombre from "./pages/consultas/ConsultaClientesNombre";
import ConsultaClientesCumple from "./pages/consultas/ConsultaClientesCumple";
import HistorialCanjesProducto from "./pages/consultas/HistorialCanjesProducto";

// REPORTES
import ReportesDashboard from "./pages/reportes/ReportesDashboard";
import RankingReport from "./pages/reportes/RankingReport";
import PuntosVencerReport from "./pages/reportes/PuntosVencerReport";
import UsosFiltrosReport from "./pages/reportes/UsosFiltrosReport";
import BolsasRangoReport from "./pages/reportes/BolsasRangoReport";
import ReporteBolsasCliente from "./pages/reportes/ReporteBolsasCliente";
import ReporteUsosConcepto from "./pages/reportes/ReporteUsosConcepto";
import ReporteUsosFecha from "./pages/reportes/ReporteUsosFecha";
import ReporteUsosCliente from "./pages/reportes/ReporteUsosCliente";
import ReporteCumpleanios from "./pages/reportes/ReporteCumpleanios";

export default function App() {

  //  Esto es CLAVE
  const [auth, setAuth] = useState(false);

  //  Esto carga el token apenas entra al sitio
  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuth(!!token);
  }, []);

  const handleLogin = () => {
    setAuth(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(false);
  };

  return (
    <BrowserRouter>
      {!auth ? (
        <Login onLogin={handleLogin} />
      ) : (
        <AppLayout onLogout={logout}>
          <Routes>

            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />

            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/nuevo" element={<ClienteForm />} />
            <Route path="/clientes/editar/:id" element={<ClienteForm />} />

            <Route path="/conceptos" element={<Conceptos />} />
            <Route path="/conceptos/nuevo" element={<ConceptoForm />} />
            <Route path="/conceptos/editar/:id" element={<ConceptoForm />} />

            <Route path="/reglas" element={<Reglas />} />
            <Route path="/reglas/nuevo" element={<ReglaForm />} />
            <Route path="/reglas/editar/:id" element={<ReglaForm />} />

            <Route path="/vencimientos" element={<VencimientosList />} />

            <Route path="/bolsas" element={<Bolsas />} />
            <Route path="/bolsas/nuevo" element={<BolsaForm />} />
            <Route path="/bolsas/editar/:id" element={<BolsaForm />} />

            <Route path="/usos" element={<Usos />} />

            <Route path="/servicios/cargar_puntos" element={<CargarPuntos />} />
            <Route path="/servicios/usar_puntos" element={<UsarPuntos />} />
            <Route path="/servicios/canje_productos" element={<CanjeProductos />} />
            <Route path="/servicios/historial_canjes" element={<HistorialCanjes />} />
            <Route path="/servicios/canje_detalle/:id" element={<DetalleCanje />} />

            <Route path="/consultas/clientes" element={<ConsultaClientes />} />
            <Route path="/consultas/bolsas_cliente" element={<ConsultaBolsasCliente />} />
            <Route path="/consultas/bolsas_rango" element={<ConsultaBolsasRango />} />
            <Route path="/consultas/puntos_a_vencer" element={<ConsultaPuntosVencer />} />
            <Route path="/consultas/ranking" element={<ConsultaRanking />} />
            <Route path="/consultas/usos_concepto" element={<ConsultaUsosConcepto />} />
            <Route path="/consultas/usos_fecha" element={<ConsultaUsosFecha />} />
            <Route path="/consultas/usos_cliente" element={<ConsultaUsosCliente />} />
            <Route path="/consultas/cumpleanieros" element={<ConsultaCumpleanieros />} />
            <Route path="/consultas/usos_rango" element={<ConsultaUsosRangoFecha />} />
            <Route path="/consultas/usos_cliente_detalle" element={<ConsultaUsosPorCliente />} />
            <Route path="/consultas/apellido" element={<ConsultaClientesApellido />} />
            <Route path="/consultas/nombre" element={<ConsultaClientesNombre />} />
            <Route path="/consultas/cumple" element={<ConsultaClientesCumple />} />
            <Route path="/consultas/historial_canje_producto" element={<HistorialCanjesProducto />} />

            <Route path="/reportes" element={<ReportesDashboard />} />
            <Route path="/reportes/ranking" element={<RankingReport />} />
            <Route path="/reportes/puntos_a_vencer" element={<PuntosVencerReport />} />
            <Route path="/reportes/usos_filtros" element={<UsosFiltrosReport />} />
            <Route path="/reportes/bolsas_rango" element={<BolsasRangoReport />} />
            <Route path="/reportes/bolsas_cliente" element={<ReporteBolsasCliente />} />
            <Route path="/reportes/usos_concepto" element={<ReporteUsosConcepto />} />
            <Route path="/reportes/usos_fecha" element={<ReporteUsosFecha />} />
            <Route path="/reportes/usos_cliente" element={<ReporteUsosCliente />} />
            <Route path="/reportes/cumpleanios" element={<ReporteCumpleanios />} />

            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </AppLayout>
      )}
    </BrowserRouter>
  );
}
