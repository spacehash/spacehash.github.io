import { useState, useRef, useEffect } from 'react';
import { Box, Button, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

function DatePickerWithHold({ dates, onAddDate, onRemoveDate, onClearDates, isDateUnavailable, isMobile }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef(null);
  const holdStartRef = useRef(null);
  const preventScrollRef = useRef((e) => e.preventDefault());
  const isHoldingRef = useRef(false);

  const isDateAlreadySelected = (dateToCheck) => {
    if (!dateToCheck) return false;
    return dates.some((d) => d.isSame(dateToCheck, 'day'));
  };

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
        onClearDates();
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, flexShrink: 0, minWidth: { xs: 95, sm: 'auto' } }}>
          <DatePicker
            value={null}
            onChange={(newDate) => onAddDate(newDate)}
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
                onDelete={() => onRemoveDate(index)}
                deleteIcon={<CloseIcon />}
                size={isMobile ? 'small' : 'medium'}
                sx={{ flexShrink: 0 }}
              />
            ))}
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
}

export default DatePickerWithHold;
