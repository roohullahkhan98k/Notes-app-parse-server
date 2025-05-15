import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UsersNotesBarChart = ({ totalUsers, totalNotes }) => {
  const barData = {
    labels: ["Total Users", "Total Notes"],
    datasets: [
      {
        label: "Data Overview",
        data: [totalUsers, totalNotes],
        backgroundColor: ["#4BC0C0", "#FF9F40"],
        borderColor: ["#4BC0C0", "#FF9F40"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded p-5 mb-10">
      <h2 className="text-xl font-bold mb-4">Users vs Notes</h2>
      <Bar data={barData} options={{ responsive: true }} />
    </div>
  );
};

export default UsersNotesBarChart;