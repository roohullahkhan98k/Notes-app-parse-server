import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Parse from "../../parseConfig";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar, Alert
} from '@mui/material';



const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const currentUser = Parse.User.current();
    if (currentUser.get("role") !== "admin") return;

    try {
      const results = await Parse.Cloud.run("getAllUsers", {}, {
        sessionToken: currentUser.getSessionToken()
      });
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
      const response = await Parse.Cloud.run("suspendUser", {
        userId: selectedUser.id
      }, { sessionToken: Parse.User.current().getSessionToken() });

      setSnack({ open: true, message: response || 'User suspended successfully.', severity: 'success' });
      fetchUsers();
      setModalOpen(false);
    } catch (error) {
      console.error("Error suspending user:", error);
      setSnack({ open: true, message: 'Error suspending user', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReactivate = async () => {
    setLoading(true);
    try {
      const response = await Parse.Cloud.run("reactivateUser", {
        userId: selectedUser.id
      }, { sessionToken: Parse.User.current().getSessionToken() });

      setSnack({ open: true, message: response || 'User reactivated successfully.', severity: 'success' });
      fetchUsers();
      setReactivateModalOpen(false);
    } catch (error) {
      console.error("Error reactivating user:", error);
      setSnack({ open: true, message: 'Error reactivating user', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (

    <div style={{ padding: '2rem 0' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/user-notes/${user.id}`)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    View Notes
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleSuspendClick(user)}
                    style={{ marginRight: '0.5rem' }}
                    disabled={user.suspended}
                  >
                    Suspend
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleReactivateClick(user)}
                    disabled={!user.suspended}
                  >
                    Reactivate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Confirm Suspension</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to suspend the account for <strong>{selectedUser?.email}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} disabled={loading}>Cancel</Button>
          <Button color="error" onClick={handleConfirmSuspend} disabled={loading}>
            {loading ? 'Suspending...' : 'Yes, Suspend'}
          </Button>
        </DialogActions>
      </Dialog>

 
      <Dialog open={reactivateModalOpen} onClose={() => setReactivateModalOpen(false)}>
        <DialogTitle>Confirm Reactivation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reactivate the account for <strong>{selectedUser?.email}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReactivateModalOpen(false)} disabled={loading}>Cancel</Button>
          <Button color="success" onClick={handleConfirmReactivate} disabled={loading}>
            {loading ? 'Reactivating...' : 'Yes, Reactivate'}
          </Button>
        </DialogActions>
      </Dialog>


      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminPanel;
