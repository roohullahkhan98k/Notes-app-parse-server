import { useState, useEffect } from "react";
import Parse from "../../parseConfig";
import { CircularProgress } from "@mui/material";
import { UserStatsCard,UserStatusChart,AnalyticsOverview,UsersNotesBarChart } from "../../components";

import "./analytics.scss";

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

  return (<>
      <div className="Analytics-Title">Analytics Dashboard</div>
    <div className="p-10">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <UserStatsCard
          title="Total Users"
          value={totalUsers}
          color="text-blue-600"
          percentage={userPercentage}
        />
        <UserStatsCard
          title="Total Notes"
          value={totalNotes}
          color="text-orange-600"
          percentage={notesPercentage}
        />
      </div>

      <UserStatusChart
        activeUsers={activeUsers}
        suspendedUsers={suspendedUsers}
      />

      <AnalyticsOverview
        totalUsers={totalUsers}
        totalNotes={totalNotes}
        activeUsers={activeUsers}
        suspendedUsers={suspendedUsers}
      />

      <UsersNotesBarChart
        totalUsers={totalUsers}
        totalNotes={totalNotes}
      />
    </div>
      </>
  );
};

export default Analytics;
