import { useState } from 'react';
import JSZip from 'jszip';
import { Button, Dialog, DialogContent, DialogActions, Typography, CircularProgress } from '@mui/material';

function EmailPromptModal({ open, onClose, email, pdfUrls, pdfDates, clientName }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!pdfUrls || pdfUrls.length === 0) return;
    setDownloading(true);

    const safeName = clientName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    try {
      if (pdfUrls.length === 1) {
        const a = document.createElement('a');
        a.href = pdfUrls[0];
        a.download = `${safeName}-${pdfDates[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const zip = new JSZip();
        for (let i = 0; i < pdfUrls.length; i++) {
          const response = await fetch(pdfUrls[i]);
          const blob = await response.blob();
          zip.file(`${safeName}-${pdfDates[i]}.pdf`, blob);
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(zipBlob);
        a.download = `${safeName}-contracts.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Download the PDF{pdfUrls && pdfUrls.length > 1 ? 's' : ''}, fill out sections 12 and 14,
          then send {pdfUrls && pdfUrls.length > 1 ? 'them' : 'it'} to:
        </Typography>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          {email}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={downloading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDownload} disabled={downloading} startIcon={downloading ? <CircularProgress size={16} /> : null}>
          {downloading ? 'Downloading…' : 'Download'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EmailPromptModal;
