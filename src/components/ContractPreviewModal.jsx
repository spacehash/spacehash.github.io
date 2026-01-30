import { Box, Button, Dialog, DialogContent, DialogActions } from '@mui/material';

function ContractPreviewModal({ open, onClose, onDownload, pdfUrls, currentIndex, onNavigate, isMobile }) {
  const currentUrl = pdfUrls[currentIndex];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile}>
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: isMobile ? '100%' : '80vh' }}>
        {currentUrl && (
          <iframe
            src={currentUrl}
            title="Contract Preview"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', p: 2, gap: 1 }}>
        {pdfUrls.length > 1 && (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {pdfUrls.map((_, idx) => (
              <Button
                key={idx}
                variant={idx === currentIndex ? 'contained' : 'outlined'}
                size="small"
                onClick={() => onNavigate(idx)}
                sx={{ minWidth: 36 }}
              >
                {idx + 1}
              </Button>
            ))}
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Back
          </Button>
          <Button variant="contained" onClick={onDownload}>
            Download
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default ContractPreviewModal;
