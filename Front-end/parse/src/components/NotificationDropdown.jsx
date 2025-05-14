import React, { useEffect, useState } from "react";
import Parse from "../parseConfig";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  // ia am using the anchorEl is used to open the menu when the icon is clicked like its postion
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const currentUser = Parse.User.current();
    if (!currentUser) return;

    const Notification = Parse.Object.extend("Notification");
    const query = new Parse.Query(Notification);
    query.equalTo("user", currentUser);
    query.equalTo("read", false);
    query.descending("createdAt");

    query.find().then((results) => {
      setNotifications(results);
      setUnreadCount(results.length);
    });

    const subscriptionPromise = query.subscribe();
    subscriptionPromise.then((subscription) => {

      //here i am handling new notis by adding them to the list and incrementing the count
      subscription.on("create", (notif) => {
     setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });   

      subscription.on("error", (err) => {
        console.error("LiveQuery error:", err);
      });
    });

    return () => {
      subscriptionPromise.then((subscription) => subscription.unsubscribe());
    };
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClearAll = async () => {
    const currentUser = Parse.User.current();
    if (!currentUser) return;

    const Notification = Parse.Object.extend("Notification");
    const query = new Parse.Query(Notification);
    query.equalTo("user", currentUser);
    query.equalTo("read", false);

    const results = await query.find();
    results.forEach((n) => n.set("read", true));
    await Parse.Object.saveAll(results);


    setNotifications([]);
    setUnreadCount(0);
  };

  const handleRead = async (notif) => {
    notif.set("read", true);
    await notif.save();

    setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div style={{ position: "absolute", top: 75, right: 440 }}>
      <IconButton onClick={handleMenuOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            width: 300,
            padding: 8,
            borderRadius: 10,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" px={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            Notifications
          </Typography>
          <Button size="small" onClick={handleClearAll} color="error">
            Clear All
          </Button>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography color="textSecondary">No unread notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((n) => (
            <MenuItem
              key={n.id}
              sx={{
                whiteSpace: "normal",
                alignItems: "flex-start",
                paddingY: 1,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Typography
                  variant="body2"
                  fontWeight={n.get("read") ? "normal" : "bold"}
                  onClick={() => handleRead(n)}
                >
                  {n.get("message")}
                </Typography>
                <Button size="small" color="error" onClick={() => handleRead(n)}>
                  Clear
                </Button>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </div>
  );
};

export default NotificationDropdown;





