import { useState, useEffect } from "react";
import Parse from "../../parseConfig";
import { NotificationDropdown,Modal,SnackbarAlert,NoteForm,NoteList } from "../../components";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";

import "./home.scss";
const Home = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [shareEmails, setShareEmails] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [readModalOpen, setReadModalOpen] = useState(false);

  const fetchNotes = async () => {
    const currentUser = Parse.User.current();
    if (!currentUser) return;

    setLoading(true);
    try {
      const results = await Parse.Cloud.run(
        "getNotes",
        {},
        {
          sessionToken: currentUser.getSessionToken(),
        }
      );
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
    if (!title.trim() || !content.trim())
      return showAlert("warning", "Title and content cannot be empty.");

    try {
      await Parse.Cloud.run(
        "saveNote",
        { title, content, noteId: editingNoteId || null },
        {
          sessionToken: currentUser.getSessionToken(),
        }
      );

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
      await Parse.Cloud.run(
        "deleteNote",
        { noteId },
        {
          sessionToken: currentUser.getSessionToken(),
        }
      );
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
    if (!email || !email.includes("@"))
      return showAlert("warning", "Enter a valid email.");

    try {
      await Parse.Cloud.run(
        "shareNote",
        { noteId, email },
        {
          sessionToken: currentUser.getSessionToken(),
        }
      );
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
    <>
    <div className="Home-title">User Notes</div>
    <Container maxWidth="md" sx={{ py: 4 }}>
      <NotificationDropdown />
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Notes
        </Typography>
        <NoteForm
          title={title}
          content={content}
          handleSave={handleSave}
          handleTitleChange={(e) => setTitle(e.target.value)}
          handleContentChange={(e) => setContent(e.target.value)}
          editingNoteId={editingNoteId}
        />
      </Paper>

      <Typography variant="h5" gutterBottom fontWeight="bold">
        Your Notes
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <NoteList
          notes={notes}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleNoteClick={handleNoteClick}
          setActiveNoteId={setActiveNoteId}
          setShareModalOpen={setShareModalOpen}
        />
      )}

      <SnackbarAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />

      <Modal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Note"
        content={
          <div style={{ width: "400px" }}>
            <Typography fontWeight="bold" sx={{ mb: 2, color: "#1976d2" }}>
              {notes.find((note) => note.id === activeNoteId)?.get("title")}
            </Typography>
            <TextField
              label="Recipient's Gmail"
              type="email"
              value={shareEmails[activeNoteId] || ""}
              onChange={(e) =>
                handleShareEmailChange(activeNoteId, e.target.value)
              }
              fullWidth
            />
          </div>
        }
        actions={[
          <Button
            onClick={() => setShareModalOpen(false)}
            sx={{ color: "#757575" }}
          >
            Cancel
          </Button>,
          <Button
            variant="contained"
            onClick={handleShare}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Share
          </Button>,
        ]}
      />

      <Modal
        open={readModalOpen}
        onClose={() => setReadModalOpen(false)}
        title="Note Details"
        content={
          <div style={{ width: "400px" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#1976d2" }}>
              {notes.find((n) => n.id === activeNoteId)?.get("title")}
            </Typography>
            {notes.find((n) => n.id === activeNoteId)?.get("sharedBy") && (
              <Typography variant="body2" sx={{ color: "#757575", mb: 2 }}>
                Shared by:{" "}
                {notes.find((n) => n.id === activeNoteId)?.get("sharedBy")}
              </Typography>
            )}
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {notes.find((n) => n.id === activeNoteId)?.get("content")}
            </Typography>
          </div>
        }
        actions={[
          <Button
            onClick={() => setReadModalOpen(false)}
            sx={{ color: "#1976d2" }}
          >
            Close
          </Button>,
        ]}
      />
    </Container>
    </>
  );
};

export default Home;
