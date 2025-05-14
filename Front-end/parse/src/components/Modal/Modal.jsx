import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const Modal = ({
  open,
  onClose,
  title,
  content,
  actions,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        {actions.map((action, index) => (
          <React.Fragment key={index}>
            {action}
          </React.Fragment>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;