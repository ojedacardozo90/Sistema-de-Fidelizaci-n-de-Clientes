// RUTA: src/layouts/Sidebar.jsx
// Sidebar A — Diseño FIGMA EXACTO — PALETA A

import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  TagIcon,
  Cog8ToothIcon,
  ClockIcon,
  DocumentTextIcon,
  GiftIcon,
  ChartBarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const menuGroups = [
    // ============================================
    // GENERAL
    // ============================================
    {
      title: "General",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: <HomeIcon className="h-5 w-5" /> },
      ],
    },

    // ============================================
    // CLIENTES
    // ============================================
    {
      title: "Clientes",
      items: [
        { to: "/clientes", label: "Listado", icon: <UserGroupIcon className="h-5 w-5" /> },
        { to: "/clientes/nuevo", label: "Nuevo Cliente", icon: <UserGroupIcon className="h-5 w-5" /> },
      ],
    },

    // ============================================
    // FIDELIZACIÓN
    // ============================================
    {
      title: "Fidelización",
      items: [
        { to: "/conceptos", label: "Conceptos", icon: <TagIcon className="h-5 w-5" /> },
        { to: "/reglas", label: "Reglas", icon: <Cog8ToothIcon className="h-5 w-5" /> },
        { to: "/vencimientos", label: "Vencimientos", icon: <ClockIcon className="h-5 w-5" /> },
        { to: "/bolsas", label: "Bolsas", icon: <GiftIcon className="h-5 w-5" /> },
        { to: "/usos", label: "Usos", icon: <ChartBarIcon className="h-5 w-5" /> },
      ],
    },

    // ============================================
    // SERVICIOS (NUEVO — CORRECTO)
    // ============================================
    {
      title: "Servicios",
      items: [
        { 
          to: "/servicios/cargar_puntos",
          label: "Cargar Puntos",
          icon: <TagIcon className="h-5 w-5" />
        },
        { 
          to: "/servicios/usar_puntos",
          label: "Usar Puntos",
          icon: <GiftIcon className="h-5 w-5" />
        },
        { 
          to: "/servicios/canje_productos",
          label: "Canje de Productos",
          icon: <ChartBarIcon className="h-5 w-5" />
        },
        { to: "/servicios/historial_canjes", label: "Historial de Canjes", icon: <DocumentTextIcon className="h-5 w-5" /> },
        { to: "/consultas/historial_canje_fecha", label: "Historial por Fecha", icon: <CalendarIcon className='h-5 w-5' /> },
        { 
          to: "/consultas/historial_canje_producto",
          label: "Historial por Producto",
          icon: <TagIcon className="h-5 w-5" />
        },
        { 
          to: "/dashboard/analytics", 
          label: "Dashboard Analítico", 
          icon: <ChartBarIcon className="h-5 w-5" /> 
        },

      ],
    },

    // ============================================
    // CONSULTAS
    // ============================================
    {
      title: "Consultas",
      items: [
        { to: "/consultas/clientes", label: "Clientes", icon: <UserGroupIcon className="h-5 w-5" /> },
        { to: "/consultas/bolsas_cliente", label: "Bolsas por Cliente", icon: <GiftIcon className="h-5 w-5" /> },
        { to: "/consultas/bolsas_rango", label: "Bolsas por Rango", icon: <GiftIcon className="h-5 w-5" /> },
        { to: "/consultas/puntos_a_vencer", label: "Puntos a Vencer", icon: <ClockIcon className="h-5 w-5" /> },
        { to: "/consultas/ranking", label: "Ranking", icon: <ChartBarIcon className="h-5 w-5" /> },
        { to: "/consultas/usos_concepto", label: "Usos por Concepto", icon: <TagIcon className="h-5 w-5" /> },
        { to: "/consultas/usos_fecha", label: "Usos por Fecha", icon: <CalendarIcon className="h-5 w-5" /> },
        { to: "/consultas/usos_cliente", label: "Usos por Cliente", icon: <UserGroupIcon className="h-5 w-5" /> },
        { to: "/consultas/cumpleanieros", label: "Cumpleañeros", icon: <CalendarIcon className="h-5 w-5" /> },
      ],
    },

    // ============================================
    // REPORTES
    // ============================================
    {
      title: "Reportes",
      items: [
        { to: "/reportes", label: "Dashboard", icon: <DocumentTextIcon className="h-5 w-5" /> },
        { to: "/reportes/bolsas_rango", label: "Bolsas por Rango", icon: <GiftIcon className="h-5 w-5" /> },
        { to: "/reportes/bolsas_cliente", label: "Bolsas por Cliente", icon: <GiftIcon className="h-5 w-5" /> },
        { to: "/reportes/usos_concepto", label: "Usos por Concepto", icon: <TagIcon className="h-5 w-5" /> },
        { to: "/reportes/usos_fecha", label: "Usos por Fecha", icon: <CalendarIcon className="h-5 w-5" /> },
        { to: "/reportes/usos_cliente", label: "Usos por Cliente", icon: <UserGroupIcon className="h-5 w-5" /> },
        { to: "/reportes/puntos_a_vencer", label: "Puntos a Vencer", icon: <ClockIcon className="h-5 w-5" /> },
        { to: "/reportes/cumpleanios", label: "Cumpleañeros", icon: <CalendarIcon className="h-5 w-5" /> },
        { to: "/reportes/ranking", label: "Ranking", icon: <ChartBarIcon className="h-5 w-5" /> },
      ],
    },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 shadow-sm px-4 py-6">
      
      {/* LOGO */}
      <div className="text-xl font-bold text-blue-600 mb-8 px-2">
        Fidelización
      </div>

      {/* MENÚ */}
      {menuGroups.map((group, gi) => (
        <div key={gi} className="mb-8">

          <div className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2 tracking-wide">
            {group.title}
          </div>

          <div className="flex flex-col gap-1">
            {group.items.map((item, ii) => (
              <NavLink
                key={ii}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all 
                  ${isActive 
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-2"
                    : "text-gray-700 hover:bg-blue-50"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}
