// RUTA: src/components/charts/FigmaBarChart.jsx
// ----------------------------------------------------------
// BarChart EXACTO según Figma (Clientes por Mes)
// ----------------------------------------------------------

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function FigmaBarChart({ labels, data }) {
  return (
    <div
      className="
        bg-white 
        rounded-xl 
        shadow-card 
        p-6 
        border border-gray-200
      "
    >
      <h2 className="text-center text-gray-700 font-semibold mb-4">
        Clientes por Mes
      </h2>

      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Clientes",
              data,
              backgroundColor: [
                "#14A098",
                "#7EC4CF",
                "#C4CAD0",
                "#C1BCAC",
                "#B9B4A8",
                "#A4A4A4",
                "#1BAA8F",
              ],
              borderRadius: 0, // Barras rectas como Figma
              barPercentage: 0.6,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              grid: { color: "#E5E7EB" },
              ticks: { color: "#6B7280" },
            },
            x: {
              ticks: { color: "#6B7280" },
            },
          },
          plugins: {
            legend: { display: false }, // Figma NO muestra leyenda
          },
        }}
        height={300}
      />
    </div>
  );
}
