import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Parse from "../../parseConfig";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Alert,
  CircularProgress,
  Box,
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
            <Grid sx={12}  key={note.id}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardHeader
                  title={note.get("title")}
                  titleTypographyProps={{
                    variant: "h6",
                    fontWeight: "bold",
                    color: "primary",
                  }}
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 6,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {note.get("content")}
                  </Typography>

                  {note.get("createdAt") && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={2}
                    >
                      Created on:{" "}
                      {new Date(note.get("createdAt")).toLocaleDateString()} at{" "}
                      {new Date(note.get("createdAt")).toLocaleTimeString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default UserNotesPage;
