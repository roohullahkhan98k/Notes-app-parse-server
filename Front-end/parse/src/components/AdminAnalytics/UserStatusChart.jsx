import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const UserStatusChart = ({ activeUsers, suspendedUsers }) => {
  const userStatusData = {
    labels: ["Active Users", "Suspended Users"],
    datasets: [
      {
        label: "User Status",
        data: [activeUsers, suspendedUsers],
        backgroundColor: ["#4CAF50", "#FF5252"],
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded p-5">
      <h2 className="text-xl font-bold mb-4 text-center">
        User Status Breakdown
      </h2>
      <div className="flex flex-col items-center">
        <div className="mb-5">
          <p className="text-lg font-semibold text-green-600">
            Active Users: {activeUsers}
          </p>
          <p className="text-lg font-semibold text-red-500">
            Suspended Users: {suspendedUsers}
          </p>
        </div>
        <div className="w-64">
          <Doughnut data={userStatusData} />
        </div>
      </div>
    </div>
  );
};

export default UserStatusChart;