import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import equipmentCsvUrl from '../resources/equipment.csv';
import unavailableCsvUrl from '../resources/unavailable.csv';

const EMAIL = 'spacehashes@gmail.com';

function parseCSV(text) {
  const lines = text.trim().split('\n');
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    return {
      id: index + 1,
      name: values[0],
      description: values[1],
      maxQty: parseInt(values[2]) || 1,
      cost: parseFloat(values[3]) || 0,
    };
  });
}

function parseUnavailableCSV(text) {
  const lines = text.trim().split('\n');
  return lines.slice(1).map((line) => {
    const [startDate, endDate] = line.split(',');
    return { startDate, endDate };
  });
}

function RentalsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [equipment, setEquipment] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [dates, setDates] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [quantities, setQuantities] = useState({});
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef(null);
  const holdStartRef = useRef(null);
  const preventScrollRef = useRef((e) => e.preventDefault());
  const isHoldingRef = useRef(false);

  const startHold = (e) => {
    if (dates.length === 0 || isHoldingRef.current) return;
    e.preventDefault();
    isHoldingRef.current = true;
    document.body.style.overflow = 'hidden';
    document.addEventListener('touchmove', preventScrollRef.current, { passive: false });
    setIsHolding(true);
    holdStartRef.current = Date.now();
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min((elapsed / 3000) * 100, 100);
      setHoldProgress(progress);
      if (progress >= 100) {
        setDates([]);
        endHold();
      }
    }, 16);
  };

  const endHold = () => {
    if (!isHoldingRef.current) return;
    isHoldingRef.current = false;
    setIsHolding(false);
    setHoldProgress(0);
    document.body.style.overflow = '';
    document.removeEventListener('touchmove', preventScrollRef.current);
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
      document.body.style.overflow = '';
      document.removeEventListener('touchmove', preventScrollRef.current);
    };
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(equipmentCsvUrl).then((res) => res.text()),
      fetch(unavailableCsvUrl).then((res) => res.text()),
    ])
      .then(([equipmentText, unavailableText]) => {
        setEquipment(parseCSV(equipmentText));
        setUnavailableDates(parseUnavailableCSV(unavailableText));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        setLoading(false);
      });
  }, []);

  const isDateUnavailable = (dateToCheck) => {
    if (!dateToCheck) return false;
    const checkDate = dayjs(dateToCheck);
    return unavailableDates.some(({ startDate, endDate }) => {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      return checkDate.isAfter(start.subtract(1, 'day')) && checkDate.isBefore(end.add(1, 'day'));
    });
  };

  const isDateAlreadySelected = (dateToCheck) => {
    if (!dateToCheck) return false;
    return dates.some((d) => d.isSame(dateToCheck, 'day'));
  };

  const handleAddDate = (newDate) => {
    if (newDate && !isDateUnavailable(newDate) && !isDateAlreadySelected(newDate)) {
      setDates((prev) => [...prev, newDate].sort((a, b) => a.unix() - b.unix()));
    }
  };

  const handleRemoveDate = (index) => {
    setDates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (id, quantity, maxQty) => {
    const qty = Math.min(maxQty, Math.max(0, parseInt(quantity) || 0));
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  const getQty = (id) => quantities[id] || 0;

  const handleSubmit = () => {
    const selectedItems = equipment.filter((item) => getQty(item.id) > 0);
    if (selectedItems.length === 0) return;

    const itemList = selectedItems
      .map((item) => `${item.name} x${getQty(item.id)} @ $${item.cost}/day`)
      .join('\n');

    const formattedDates = dates.map((d) => d.format('YYYY-MM-DD')).join(', ');
    const subject = encodeURIComponent('RENTAL REQUEST');
    const total = selectedItems.reduce((sum, item) => sum + getQty(item.id) * item.cost, 0) * dates.length;
    const body = encodeURIComponent(
      `Name: ${name}\nDate(s): ${formattedDates}\n\nEquipment:\n${itemList}\n\nTotal: $${total} (${dates.length} day${dates.length > 1 ? 's' : ''})${comments ? `\n\nComments:\n${comments}` : ''}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  const hasSelections = equipment.some((item) => getQty(item.id) > 0);
  const hasDates = dates.length > 0;
  const isFormValid = hasSelections && name.trim() && hasDates;

  const getLineTotal = (item) => {
    const qty = getQty(item.id);
    if (qty < 1) return null;
    return qty * item.cost;
  };

  const totalPrice = equipment.reduce((sum, item) => {
    return sum + getQty(item.id) * item.cost;
  }, 0);

  const renderDay = (day, _selectedDays, pickersDayProps) => {
    const isUnavailable = isDateUnavailable(day);

    return (
      <PickersDay
        {...pickersDayProps}
        disabled={pickersDayProps.disabled || isUnavailable}
        sx={
          isUnavailable
            ? {
                backgroundColor: 'error.light',
                color: 'error.contrastText',
                '&:hover': { backgroundColor: 'error.main' },
                '&.Mui-disabled': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText',
                },
              }
            : {}
        }
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{
        p: { xs: 1.5, sm: 3 },
        maxWidth: 900,
        mx: 'auto',
        width: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}>
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            textAlign: 'center',
            fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.5rem' },
          }}
        >
          Equipment Rentals
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size={isMobile ? 'small' : 'medium'}
          />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, flexShrink: 0, minWidth: { xs: 95, sm: 'auto' } }}>
              <DatePicker
                value={null}
                onChange={(newDate) => handleAddDate(newDate)}
                open={pickerOpen}
                onOpen={() => setPickerOpen(true)}
                onClose={() => setPickerOpen(false)}
                closeOnSelect={false}
                shouldDisableDate={(d) => isDateUnavailable(d) || isDateAlreadySelected(d)}
                renderDay={renderDay}
                renderInput={(params) => (
                  <Button
                    variant="outlined"
                    startIcon={isHolding ? <CloseIcon /> : <AddIcon />}
                    size={isMobile ? 'small' : 'medium'}
                    ref={params.inputRef}
                    onClick={() => !isHolding && setPickerOpen(true)}
                    onMouseDown={startHold}
                    onMouseUp={endHold}
                    onMouseLeave={endHold}
                    onTouchStart={startHold}
                    onTouchEnd={endHold}
                    onTouchCancel={endHold}
                    sx={{
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'border-color 0.15s, color 0.15s',
                      ...(isHolding && {
                        borderColor: 'error.main',
                        color: 'error.main',
                      }),
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${holdProgress}%`,
                        backgroundColor: 'error.main',
                        opacity: isHolding ? 0.25 : 0,
                        zIndex: 0,
                      },
                      '& .MuiButton-startIcon, & .MuiButton-label': {
                        position: 'relative',
                        zIndex: 1,
                      },
                    }}
                  >
                    <span style={{ position: 'relative', zIndex: 1 }}>
                      {isHolding ? 'Remove All' : 'Add Date'}
                    </span>
                  </Button>
                )}
                disablePast
              />
            </Box>
            {dates.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  overflowX: 'auto',
                  flexGrow: 1,
                  py: 0.5,
                  '&::-webkit-scrollbar': { height: 4 },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: 'divider', borderRadius: 2 },
                }}
              >
                {dates.map((d, index) => (
                  <Chip
                    key={index}
                    label={d.format('MMM D, YYYY')}
                    onDelete={() => handleRemoveDate(index)}
                    deleteIcon={<CloseIcon />}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{ flexShrink: 0 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 2, overflowX: 'auto' }}>
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
                            onClick={() => handleQuantityChange(item.id, getQty(item.id) - 1, item.maxQty)}
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
                            onClick={() => handleQuantityChange(item.id, getQty(item.id) + 1, item.maxQty)}
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

        <TextField
          label="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          multiline
          rows={isMobile ? 2 : 3}
          fullWidth
          size={isMobile ? 'small' : 'medium'}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size={isMobile ? 'medium' : 'large'}
            disabled={!isFormValid}
            onClick={handleSubmit}
            fullWidth={isMobile}
          >
            Submit Request
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default RentalsPage;
