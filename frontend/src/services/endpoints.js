// RUTA: src/services/endpoints.js
// ENDPOINTS CORRECTOS PARA JWT + CRUDs + CONSULTAS

export const endpoints = {

  // ============================
  // AUTH CORRECTO (JWT)
  // ============================
  login: "auth/login/",
  refresh: "auth/refresh/",

  // ============================
  // CRUDs PRINCIPALES
  // ============================
  clientes: "clientes/",
  conceptos: "conceptos/",
  reglas: "reglas/",
  vencimientos: "vencimientos/",
  bolsas: "bolsas/",
  usos: "usos/",

  // ============================
  // CONSULTAS
  // ============================
  consultas: {
    puntos_a_vencer: "consultas/puntos_a_vencer/",
    ranking: "consultas/ranking/",
    bolsas_por_rango: "consultas/bolsas_por_rango/",
    usos_por_concepto: "consultas/usos_por_concepto/",
    usos_por_fecha: "consultas/usos_por_fecha/",
    usos_por_cliente: "consultas/usos_por_cliente/",
    bolsas_por_cliente: "consultas/bolsas_por_cliente/",
  },

  // ============================
  // SERVICIOS
  // ============================
  servicios: {
    cargar_puntos: "servicios/cargar_puntos/",
    usar_puntos: "servicios/usar_puntos/",
    puntos_por_monto: "servicios/puntos_por_monto/",
  },

  // ============================
  // DASHBOARD
  // ============================
  dashboard_metrics: "dashboard_metrics/",
  dashboard_analytics: "dashboard_analytics/",
};
