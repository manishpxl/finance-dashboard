import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Chart({ type, data, title }) {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-card__canvas">
        {type === "line" ? (
          <Line data={data} options={commonOptions} />
        ) : (
          <Doughnut data={data} options={commonOptions} />
        )}
      </div>
    </div>
  );
}