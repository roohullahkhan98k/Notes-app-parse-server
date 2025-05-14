import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import NoteIcon from "@mui/icons-material/Note";
import PersonIcon from "@mui/icons-material/Person";
import Logout from "./logout";
import Parse from "../parseConfig";

const drawerWidth = 240;

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const user = Parse.User.current();
  const profilePicture = user.get("profileImage");
  const username = user.get("username");

  const adminItems = [
    {
      text: "Users",
      icon: <PeopleIcon />,
      path: "/admin",
    },
    {
      text: "Analytics",
      icon: <BarChartIcon />,
      path: "/analytics",
    },
  ];

  const userItems = [
    {
      text: "Notes",
      icon: <NoteIcon />,
      path: "/home",
    },
    {
      text: "User Profile",
      icon: <PersonIcon />,
      path: "/userprofile",
    },
  ];

  const items = role === "admin" ? adminItems : userItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#1e1e2f",
          color: "white",
        },
      }}
    >
      <Box sx={{ p: 2, pt: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
        </Typography>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
      </Box>

      <List sx={{ mt: 1, flexGrow: 1 }}>
        {items.map((item, index) => (
          <ListItemButton key={index} onClick={() => navigate(item.path)}>
            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
        <Logout />
      </List>
      <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={profilePicture ? profilePicture.url() : ""}
            alt={username}
            sx={{ width: 42, height: 42, mr: 1 }}
          />
          <Typography
            variant="body1"
            sx={{
              fontSize: 14,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {username}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
