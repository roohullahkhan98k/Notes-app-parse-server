import { Box, TextField, Button } from '@mui/material';

const NoteForm = ({ title, content, handleSave, handleTitleChange, handleContentChange, editingNoteId }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Title"
        fullWidth
        value={title}
        onChange={handleTitleChange}
      />
      <TextField
        label="Write your note..."
        multiline
        rows={4}
        fullWidth
        value={content}
        onChange={handleContentChange}
      />
      <Button
        variant="contained"
        onClick={handleSave}
        sx={{ alignSelf: "flex-start", borderRadius: 20, px: 4 }}
      >
        {editingNoteId ? "Update Note" : "Add Note"}
      </Button>
    </Box>
  );
};

export default NoteForm;