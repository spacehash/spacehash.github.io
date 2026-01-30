import { Button, Dialog, DialogContent, DialogActions, Typography } from '@mui/material';

function EmailPromptModal({ open, onClose, onEmail, email, isMobile }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Almost done!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please attach the downloaded contract PDF(s) to your email.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Send to: <strong>{email}</strong>
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onEmail}>
          Email
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EmailPromptModal;
