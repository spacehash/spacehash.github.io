import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function EquipmentTable({ equipment, quantities, onQuantityChange, isMobile }) {
  const getQty = (id) => quantities[id] || 0;

  const getLineTotal = (item) => {
    const qty = getQty(item.id);
    if (qty < 1) return null;
    return qty * item.cost;
  };

  const totalPrice = equipment.reduce((sum, item) => sum + getQty(item.id) * item.cost, 0);

  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
      <Table size={isMobile ? 'small' : 'medium'} sx={{ minWidth: isMobile ? 300 : 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 2 } }}>
              Equipment
            </TableCell>
            {!isMobile && <TableCell>Description</TableCell>}
            <TableCell align="center" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 2 } }}>
              Qty
            </TableCell>
            <TableCell
              align="right"
              sx={{
                color: 'success.main',
                width: { xs: 60, sm: 90 },
                minWidth: { xs: 60, sm: 90 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                py: { xs: 1, sm: 2 },
              }}
            >
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equipment.map((item) => {
            const lineTotal = getLineTotal(item);
            return (
              <TableRow key={item.id} hover>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 0.5, sm: 2 } }}>
                  {item.name}
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {item.description}
                  </TableCell>
                )}
                <TableCell align="center" sx={{ py: { xs: 0.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                      <IconButton
                        size="small"
                        onClick={() => onQuantityChange(item.id, getQty(item.id) - 1, item.maxQty)}
                        disabled={getQty(item.id) <= 0}
                        sx={{
                          width: { xs: 28, sm: 32 },
                          height: { xs: 28, sm: 32 },
                          border: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <RemoveIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                      </IconButton>
                      <Typography
                        sx={{
                          minWidth: { xs: 24, sm: 32 },
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        {getQty(item.id)}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => onQuantityChange(item.id, getQty(item.id) + 1, item.maxQty)}
                        disabled={getQty(item.id) >= item.maxQty}
                        sx={{
                          width: { xs: 28, sm: 32 },
                          height: { xs: 28, sm: 32 },
                          border: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <AddIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.6rem', sm: '0.7rem' },
                      }}
                    >
                      max {item.maxQty}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: 'success.main',
                    fontWeight: 'bold',
                    width: { xs: 60, sm: 90 },
                    minWidth: { xs: 60, sm: 90 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: { xs: 0.5, sm: 2 },
                  }}
                >
                  {lineTotal !== null && `$${lineTotal}`}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell
              colSpan={isMobile ? 2 : 3}
              align="right"
              sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.875rem' }, py: { xs: 1, sm: 2 } }}
            >
              Total:
            </TableCell>
            <TableCell
              align="right"
              sx={{
                color: 'success.main',
                fontWeight: 'bold',
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                width: { xs: 60, sm: 90 },
                minWidth: { xs: 60, sm: 90 },
                py: { xs: 1, sm: 2 },
              }}
            >
              ${totalPrice}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EquipmentTable;
