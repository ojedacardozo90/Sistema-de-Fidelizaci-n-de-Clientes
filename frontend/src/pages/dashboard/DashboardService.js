// RUTA: src/pages/dashboard/DashboardService.js
// --------------------------------------------------------------
// Servicio para obtener métricas desde el backend:
// GET /api/dashboard_metrics/
// --------------------------------------------------------------

import api from "../../services/api";

export async function getDashboardMetrics() {
  const res = await api.get("dashboard_metrics/");
  return res.data;
}
