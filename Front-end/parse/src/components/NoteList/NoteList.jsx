import { Grid } from '@mui/material';
import NoteCard from '../../components/NoteCard/NoteCard';

const NoteList = ({ notes, handleEdit, handleDelete, handleNoteClick, setActiveNoteId, setShareModalOpen }) => {
  return (
    <Grid container spacing={3}>
      {notes.map((note) => (
        <Grid item xs={12} sm={6} key={note.id}>
          <NoteCard
            note={note}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleNoteClick={handleNoteClick}
            setActiveNoteId={setActiveNoteId}
            setShareModalOpen={setShareModalOpen}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default NoteList;