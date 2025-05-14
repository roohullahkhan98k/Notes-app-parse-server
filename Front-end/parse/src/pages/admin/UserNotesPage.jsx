import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NoteCard from "../../components/NoteCard/NoteCard";
import Parse from "../../parseConfig";

import {
  Container,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Grid
} from "@mui/material";

const UserNotesPage = () => {
  const { userId } = useParams();
  const [notes, setNotes] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const allUsersResponse = await Parse.Cloud.run(
        "getAllUsers",
        {},
        { sessionToken: Parse.User.current().getSessionToken() }
      );
      const user = allUsersResponse.users.find((u) => u.id === userId);
      setUserEmail(user.email);
  
      const results = await Parse.Cloud.run(
        "getUserNotes",
        { userId },
        { sessionToken: Parse.User.current().getSessionToken() }
      );
      setNotes(results);
    } catch (error) {
      console.error("Error fetching user notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        color="primary"
      >
        User Notes
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        color="textSecondary"
        mb={4}
      >
        {userEmail}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : notes.length === 0 ? (
        <Alert severity="info" sx={{ mt: 3, textAlign: "center" }}>
          No notes available for this user.
        </Alert>
      ) : (
   <Grid container spacing={3}>
       {notes.map((note) => (
   <Grid item xs={12} key={note.id}>
     <NoteCard note={note} variant="userNotes" hideActions={true} />
    </Grid>
  ))}
</Grid>
      )}
    </Container>
  );
};

export default UserNotesPage;
