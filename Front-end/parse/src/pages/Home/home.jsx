import React, { useState, useEffect } from "react";
import Parse from "../../parseConfig";
import NotificationDropdown from "../../components/NotificationDropdown";
import IosShareIcon from "@mui/icons-material/IosShare";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
} from "@mui/material";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [shareEmails, setShareEmails] = useState({});
  const [alert, setAlert] = useState({ open: false, severity: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [readModalOpen, setReadModalOpen] = useState(false);

  const fetchNotes = async () => {
    const currentUser = Parse.User.current();
    if (!currentUser) return;

    setLoading(true);
    try {
      const results = await Parse.Cloud.run("getNotes", {}, {
        sessionToken: currentUser.getSessionToken(),
      });
      setNotes(results);
    } catch (error) {
      console.error("Error fetching notes:", error);
      showAlert("error", "Failed to load notes.");
    }
    setLoading(false);
  };

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleSave = async () => {
    const currentUser = Parse.User.current();
    if (!currentUser) return showAlert("error", "Login required!");
    if (!title.trim() || !content.trim()) return showAlert("warning", "Title and content cannot be empty.");

    try {
      await Parse.Cloud.run("saveNote", { title, content, noteId: editingNoteId || null }, {
        sessionToken: currentUser.getSessionToken(),
      });

      setTitle("");
      setContent("");
      setEditingNoteId(null);
      fetchNotes();
      showAlert("success", editingNoteId ? "Note updated!" : "Note added!");
    } catch (error) {
      console.error("Error saving note:", error);
      showAlert("error", "Could not save the note.");
    }
  };

  const handleDelete = async (noteId) => {
    const currentUser = Parse.User.current();
    if (!currentUser) return;

    try {
      await Parse.Cloud.run("deleteNote", { noteId }, {
        sessionToken: currentUser.getSessionToken(),
      });
      fetchNotes();
      showAlert("info", "Note deleted.");
    } catch (error) {
      console.error("Error deleting note:", error);
      showAlert("error", "Failed to delete the note.");
    }
  };

  const handleEdit = (note) => {
    setTitle(note.get("title"));
    setContent(note.get("content"));
    setEditingNoteId(note.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = async () => {
    const currentUser = Parse.User.current();
    const noteId = activeNoteId;
    const email = shareEmails[noteId];

    if (!currentUser) return;
    if (!email || !email.includes("@")) return showAlert("warning", "Enter a valid email.");

    try {
      await Parse.Cloud.run("shareNote", { noteId, email }, {
        sessionToken: currentUser.getSessionToken(),
      });
      showAlert("success", "Note shared!");
      setShareEmails((prev) => ({ ...prev, [noteId]: "" }));
      setShareModalOpen(false);
    } catch (error) {
      console.error("Error sharing note:", error);
      showAlert("error", "Failed to share note.");
    }
  };

  const handleNoteClick = (noteId) => {
    setActiveNoteId(noteId);
    setReadModalOpen(true);
  };

  const handleShareEmailChange = (noteId, value) => {
    setShareEmails((prev) => ({ ...prev, [noteId]: value }));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4  }}>
      <NotificationDropdown />
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Notes
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Write your note..."
            multiline
            rows={4}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ alignSelf: "flex-start", borderRadius: 20, px: 4 }}
          >
            {editingNoteId ? "Update Note" : "Add Note"}
          </Button>
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom fontWeight="bold">
        Your Notes
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} key={note.id}>
                <Paper elevation={3} sx={{ borderRadius: 3, p: 2, backgroundColor: "#fff" }}>
                <Card elevation={0} sx={{ boxShadow: "none" }}>
                  <CardContent onClick={() => handleNoteClick(note.id)} sx={{ cursor: "pointer" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {note.get("title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {note.get("content")}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 1 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button size="small" onClick={() => handleEdit(note)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDelete(note.id)}>
                        Delete
                      </Button>
                    </Box>
                    <IconButton
                      onClick={() => {
                        setActiveNoteId(note.id);
                        setShareModalOpen(true);
                      }}
                    >
                      <IosShareIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onClose={() => setShareModalOpen(false)}>
        <DialogTitle>Share Note</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography fontWeight="bold">
            {notes.find((note) => note.id === activeNoteId)?.get("title")}
          </Typography>
          <TextField
            label="Recipient's Gmail"
            type="email"
            value={shareEmails[activeNoteId] || ""}
            onChange={(e) => handleShareEmailChange(activeNoteId, e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleShare}>Share</Button>
        </DialogActions>
      </Dialog>

      {/* Read Modal */}
      <Dialog open={readModalOpen} onClose={() => setReadModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Note Details</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>
            {notes.find((n) => n.id === activeNoteId)?.get("title")}
          </Typography>
          {notes.find((n) => n.id === activeNoteId)?.get("sharedBy") && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Shared by: {notes.find((n) => n.id === activeNoteId)?.get("sharedBy")}
            </Typography>
          )}
          <Typography variant="body1">
            {notes.find((n) => n.id === activeNoteId)?.get("content")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReadModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
