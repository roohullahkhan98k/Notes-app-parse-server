import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

import "./admintable.scss"

const AdminTable = ({ users, handleSuspendClick, handleReactivateClick, navigate }) => {
  return (
<>
    <div className="Admin-Title">User Managment</div>
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
                  style={{ marginRight: "0.5rem" }}
                >
                  View Notes
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleSuspendClick(user)}
                  style={{ marginRight: "0.5rem" }}
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
    </>
  );
};

export default AdminTable;