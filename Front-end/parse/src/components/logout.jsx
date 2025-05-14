import React from "react";
import { useNavigate } from "react-router-dom";
import Parse from "../parseConfig";
import LogoutIcon from "@mui/icons-material/Logout";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

const Logout = ({ sx, iconColor = "white" }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <ListItemButton onClick={handleLogout} sx={sx}>
      <ListItemIcon sx={{ color: iconColor }}>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  );
};

export default Logout;