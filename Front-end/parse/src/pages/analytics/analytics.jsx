import React, { useState, useEffect } from "react";
import Parse from "../../parseConfig";
import { CircularProgress, LinearProgress } from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [suspendedUsers, setSuspendedUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const usersResponse = await Parse.Cloud.run("getUserStats");
        setTotalUsers(usersResponse.totalUsers);
        setActiveUsers(usersResponse.activeUsers);
        setSuspendedUsers(usersResponse.suspendedUsers);

        const totalNotesCount = await Parse.Cloud.run("getTotalNotes");
        setTotalNotes(totalNotesCount);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  const total = totalUsers + totalNotes;
  const userPercentage = (totalUsers / total) * 100;
  const notesPercentage = (totalNotes / total) * 100;

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
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow-md rounded p-5">
          <h2 className="text-xl font-bold mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
          <LinearProgress
            variant="determinate"
            value={userPercentage}
            sx={{
              height: 20,
              borderRadius: 10,
              background: "rgba(0, 0, 0, 0.1)",
              "& .MuiLinearProgress-bar": {
                backgroundImage:
                  "linear-gradient(90deg, rgba(75, 192, 192, 1) 0%, rgba(75, 192, 192, 0.5) 100%)",
              },
            }}
            className="mt-4"
          />
        </div>

        <div className="bg-white shadow-md rounded p-5">
          <h2 className="text-xl font-bold mb-2">Total Notes</h2>
          <p className="text-3xl font-bold text-orange-600">{totalNotes}</p>
          <LinearProgress
            variant="determinate"
            value={notesPercentage}
            sx={{
              height: 20,
              borderRadius: 10,
              background: "rgba(0, 0, 0, 0.1)",
              "& .MuiLinearProgress-bar": {
                backgroundImage:
                  "linear-gradient(90deg, rgba(255, 159, 64, 1) 0%, rgba(255, 159, 64, 0.5) 100%)",
              },
            }}
            className="mt-4"
          />
        </div>
      </div>

       
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


      <div className="bg-white shadow-md rounded p-5 mb-10">
        <h2 className="text-xl font-bold mb-2">Analytics Overview</h2>
        <p>Total Users: {totalUsers}</p>
        <p>Total Notes: {totalNotes}</p>
        <p>Active Users: {activeUsers}</p>
        <p>Suspended Users: {suspendedUsers}</p>
      </div>

    
      

      <div className="bg-white shadow-md rounded p-5 mb-10">
        <h2 className="text-xl font-bold mb-4">Users vs Notes</h2>
        <Bar data={barData} options={{ responsive: true }} />
      </div>

    </div>
  );
};

export default Analytics;
