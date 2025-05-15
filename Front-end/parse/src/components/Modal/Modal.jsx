import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({
  open,
  onClose,
  title,
  content,
  actions = [],
  maxWidth = 'sm',
  hideCloseButton = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      {!hideCloseButton && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      )}
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{content}</DialogContent>
      {actions.length > 0 && <DialogActions>{actions.map((a, i) => <React.Fragment key={i}>{a}</React.Fragment>)}</DialogActions>}
    </Dialog>
  );
};

export default Modal;
