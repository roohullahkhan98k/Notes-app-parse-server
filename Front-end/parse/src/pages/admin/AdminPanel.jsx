import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Parse from "../../parseConfig";
import { AdminTable,SnackbarAlert,Modal } from "../../components";
import {
  Button,
  DialogContentText,
} from "@mui/material";

import "./admin.scss";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const currentUser = Parse.User.current();
    if (currentUser.get("role") !== "admin") return;

    try {
      const results = await Parse.Cloud.run(
        "getAllUsers",
        {},
        {
          sessionToken: currentUser.getSessionToken(),
        }
      );
      setUsers(results.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSuspendClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleReactivateClick = (user) => {
    setSelectedUser(user);
    setReactivateModalOpen(true);
  };

  const handleConfirmSuspend = async () => {
    setLoading(true);
    try {
      const response = await Parse.Cloud.run(
        "suspendUser",
        {
          userId: selectedUser.id,
        },
        { sessionToken: Parse.User.current().getSessionToken() }
      );

      setSnack({
        open: true,
        message: response || "User suspended successfully.",
        severity: "success",
      });
      fetchUsers();
      setModalOpen(false);
    } catch (error) {
      console.error("Error suspending user:", error);
      setSnack({
        open: true,
        message: "Error suspending user",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReactivate = async () => {
    setLoading(true);
    try {
      const response = await Parse.Cloud.run(
        "reactivateUser",
        {
          userId: selectedUser.id,
        },
        { sessionToken: Parse.User.current().getSessionToken() }
      );

      setSnack({
        open: true,
        message: response || "User reactivated successfully.",
        severity: "success",
      });
      fetchUsers();
      setReactivateModalOpen(false);
    } catch (error) {
      console.error("Error reactivating user:", error);
      setSnack({
        open: true,
        message: "Error reactivating user",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
   <div>
        <div className="Admin-Title">Users Managment</div>
      <AdminTable
        users={users}
        handleSuspendClick={handleSuspendClick}
        handleReactivateClick={handleReactivateClick}
        navigate={navigate}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Suspension"
        content={
          <DialogContentText>
            Are you sure you want to suspend the account for{" "}
            <strong>{selectedUser?.email}</strong>?
          </DialogContentText>
        }
        actions={[
          <Button onClick={() => setModalOpen(false)} disabled={loading}>
            Cancel
          </Button>,
          <Button
            color="error"
            onClick={handleConfirmSuspend}
            disabled={loading}
          >
            {loading ? "Suspending..." : "Yes, Suspend"}
          </Button>,
        ]}
      />

      <Modal
        open={reactivateModalOpen}
        onClose={() => setReactivateModalOpen(false)}
        title="Confirm Reactivation"
        content={
          <DialogContentText>
            Are you sure you want to reactivate the account for{" "}
            <strong>{selectedUser?.email}</strong>?
          </DialogContentText>
        }
        actions={[
          <Button
            onClick={() => setReactivateModalOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>,
          <Button
            color="success"
            onClick={handleConfirmReactivate}
            disabled={loading}
          >
            {loading ? "Reactivating..." : "Yes, Reactivate"}
          </Button>,
        ]}
      />

      <SnackbarAlert
        open={snack.open}
        message={snack.message}
        severity={snack.severity}
        onClose={() => setSnack({ ...snack, open: false })}
      />
    </div>
  );
};

export default AdminPanel;
