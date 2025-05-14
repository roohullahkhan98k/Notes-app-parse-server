import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Paper,
  Box,
} from "@mui/material";
import IosShareIcon from "@mui/icons-material/IosShare";

const NoteCard = ({
  note,
  handleEdit,
  handleDelete,
  handleNoteClick,
  setActiveNoteId,
  setShareModalOpen,
  hideActions = false,
  variant = "default",
}) => {
  return (
    <Paper elevation={3} sx={{ borderRadius: 3, p: 2, backgroundColor: "#fff" }}>
      <Card elevation={0} sx={{ boxShadow: "none" }}>
        <CardContent
          onClick={() => handleNoteClick && handleNoteClick(note.id)}
          sx={{ cursor: handleNoteClick ? "pointer" : "default" }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {note.get("title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap={variant === "default"}>
            {note.get("content")}
          </Typography>
          {variant === "userNotes" && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
            </Typography>
          )}
        </CardContent>
        {!hideActions && (
          <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 1 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              {handleEdit && (
                <Button size="small" onClick={() => handleEdit(note)}>
                  Edit
                </Button>
              )}
              {handleDelete && (
                <Button size="small" color="error" onClick={() => handleDelete(note.id)}>
                  Delete
                </Button>
              )}
            </Box>
            {setActiveNoteId && setShareModalOpen && (
              <IconButton
                onClick={() => {
                  setActiveNoteId(note.id);
                  setShareModalOpen(true);
                }}
              >
                <IosShareIcon />
              </IconButton>
            )}
          </CardActions>
        )}
        {variant === "userNotes" && note.get("createdAt") && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={2}
            sx={{ px: 2, pb: 1 }}
          >
            Created on: {new Date(note.get("createdAt")).toLocaleDateString()} at{" "}
            {new Date(note.get("createdAt")).toLocaleTimeString()}
          </Typography>
        )}
      </Card>
    </Paper>
  );
};

export default NoteCard;