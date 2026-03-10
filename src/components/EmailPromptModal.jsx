import { Button, Dialog, DialogContent, DialogActions, Typography } from '@mui/material';

function EmailPromptModal({ open, onClose, email }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Initial (section 12) and sign (section 14) the PDF and email it to:
        </Typography>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          {email}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button variant="contained" onClick={onClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EmailPromptModal;
