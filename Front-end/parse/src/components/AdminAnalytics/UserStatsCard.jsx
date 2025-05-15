import { LinearProgress } from "@mui/material";

const UserStatsCard = ({ title, value, color, percentage }) => {
  return (
    <div className="bg-white shadow-md rounded p-5">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 20,
          borderRadius: 10,
          background: "rgba(0, 0, 0, 0.1)",
          "& .MuiLinearProgress-bar": {
            backgroundImage:
              `linear-gradient(90deg, ${color.includes("blue") ? "rgba(75,192,192,1)" : "rgba(255,159,64,1)"} 0%, ${color.includes("blue") ? "rgba(75,192,192,0.5)" : "rgba(255,159,64,0.5)"} 100%)`,
          },
        }}
        className="mt-4"
      />
    </div>
  );
};

export default UserStatsCard;
