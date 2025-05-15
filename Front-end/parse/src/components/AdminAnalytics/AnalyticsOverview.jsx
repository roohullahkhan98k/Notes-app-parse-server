const AnalyticsOverview = ({ totalUsers, totalNotes, activeUsers, suspendedUsers }) => {
  return (
    <div className="bg-white shadow-md rounded p-5 mb-10">
      <h2 className="text-xl font-bold mb-2">Analytics Overview</h2>
      <p>Total Users: {totalUsers}</p>
      <p>Total Notes: {totalNotes}</p>
      <p>Active Users: {activeUsers}</p>
      <p>Suspended Users: {suspendedUsers}</p>
    </div>
  );
};

export default AnalyticsOverview;
