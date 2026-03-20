import { useState, useEffect, useRef } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CRTDialog from './CRTDialog';

function DateGearModal({ open, date, equipment, reservations, initialQuantities, onSave, onCancel }) {
  const [quantities, setQuantities] = useState({});
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) setQuantities(initialQuantities || {});
  }, [open]); // eslint-disable-line

  if (!date) return null;

  const dateStr = date.format('YYYY-MM-DD');
  const reservedForDate = reservations[dateStr] || {};

  const getQty = (id) => quantities[id] || 0;

  const getAvailableQty = (item) => {
    const reservedQty = reservedForDate[item.name] || 0;
    return Math.max(0, item.maxQty - reservedQty);
  };

  const handleQtyChange = (id, newQty, availableQty) => {
    const qty = Math.min(availableQty, Math.max(0, parseInt(newQty) || 0));
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  return (
    <CRTDialog ref={dialogRef} open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>{date.format('dddd, MMMM D, YYYY')}</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Equipment</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="right" sx={{ color: 'success.main' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipment.map((item) => {
              const availableQty = getAvailableQty(item);
              const isFullyReserved = availableQty === 0;
              const reservedQty = reservedForDate[item.name] || 0;
              const qty = getQty(item.id);
              const lineTotal = qty > 0 ? qty * item.cost : null;

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography
                      sx={{
                        textDecoration: isFullyReserved ? 'line-through' : 'none',
                        color: isFullyReserved ? 'text.disabled' : 'text.primary',
                        fontSize: '0.875rem',
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ${item.cost}/day
                      {reservedQty > 0 && ` · ${reservedQty} of ${item.maxQty} reserved`}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {isFullyReserved ? (
                      <Typography variant="caption" color="error.main">
                        Unavailable
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQtyChange(item.id, qty - 1, availableQty)}
                            disabled={qty <= 0}
                            sx={{ width: 28, height: 28, border: 1, borderColor: 'divider' }}
                          >
                            <RemoveIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {qty}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQtyChange(item.id, qty + 1, availableQty)}
                            disabled={qty >= availableQty}
                            sx={{ width: 28, height: 28, border: 1, borderColor: 'divider' }}
                          >
                            <AddIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                          max {availableQty}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '0.875rem' }}>
                    {lineTotal !== null && `$${lineTotal}`}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 2, gap: 1 }}>
        <Button variant="outlined" onClick={() => dialogRef.current?.close(onCancel)}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => dialogRef.current?.close(() => onSave(dateStr, quantities))}>
          Save
        </Button>
      </DialogActions>
    </CRTDialog>
  );
}

export default DateGearModal;
