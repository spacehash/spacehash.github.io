import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import DateGearModal from './DateGearModal';

function RentalCalendar({ equipment, dateSelections, reservations, isDateUnavailable, onSaveDateSelection }) {
  const [modalDate, setModalDate] = useState(null);

  const handleDateChange = (newDate) => {
    setModalDate(newDate);
  };

  const renderDay = (day, _selectedDays, pickersDayProps) => {
    const dateStr = day.format('YYYY-MM-DD');
    const isOutside = pickersDayProps.outsideCurrentMonth;
    const hasSelections =
      !isOutside &&
      dateSelections[dateStr] &&
      Object.values(dateSelections[dateStr]).some((qty) => qty > 0);
    const isUnavailable = !isOutside && isDateUnavailable(day);

    return (
      <Box key={dateStr} sx={{ position: 'relative', display: 'inline-flex' }}>
        <PickersDay
          {...pickersDayProps}
          sx={{
            ...(isUnavailable && {
              color: 'error.main',
              textDecoration: 'line-through',
              '&.Mui-disabled': {
                color: 'error.main',
                textDecoration: 'line-through',
                opacity: 0.6,
              },
            }),
          }}
        />
        {hasSelections && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 3,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 5,
              height: 5,
              borderRadius: '50%',
              bgcolor: 'success.main',
              pointerEvents: 'none',
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Click a date to select gear
        </Typography>
        <CalendarPicker
          date={null}
          onChange={handleDateChange}
          disablePast
          shouldDisableDate={isDateUnavailable}
          renderDay={renderDay}
          views={['day']}
        />
      </Box>
      <DateGearModal
        open={!!modalDate}
        date={modalDate}
        equipment={equipment}
        reservations={reservations}
        initialQuantities={modalDate ? dateSelections[modalDate.format('YYYY-MM-DD')] || {} : {}}
        onSave={(dateStr, quantities) => {
          onSaveDateSelection(dateStr, quantities);
          setModalDate(null);
        }}
        onCancel={() => setModalDate(null)}
      />
    </LocalizationProvider>
  );
}

export default RentalCalendar;
