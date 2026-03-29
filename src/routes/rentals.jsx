import { useState, useEffect } from 'react';
import { Box, TextField, Button, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { parseCSV, parseReservationsCSV } from '../utils/csv';
import RentalCalendar from '../components/RentalCalendar';
import ContractReviewStep from '../components/ContractReviewStep';
import equipmentCsvUrl from '../resources/equipment.csv';
import reservationsCsvUrl from '../resources/reservations.csv';

function RentalsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [equipment, setEquipment] = useState([]);
  const [reservations, setReservations] = useState({});
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [dateSelections, setDateSelections] = useState({});
  const [comments, setComments] = useState('');
  const [step, setStep] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(equipmentCsvUrl).then((res) => res.text()),
      fetch(reservationsCsvUrl).then((res) => res.text()),
    ])
      .then(([equipmentText, reservationsText]) => {
        setEquipment(parseCSV(equipmentText));
        setReservations(parseReservationsCSV(reservationsText));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        setLoading(false);
      });
  }, []);

  const isDateUnavailable = (dateToCheck) => {
    if (!dateToCheck || equipment.length === 0) return false;
    const dateStr = dayjs(dateToCheck).format('YYYY-MM-DD');
    const dayReservations = reservations[dateStr];
    if (!dayReservations) return false;
    return equipment.every((item) => (dayReservations[item.name] || 0) >= item.maxQty);
  };

  const handleSaveDateSelection = (dateStr, quantities) => {
    const hasAny = Object.values(quantities).some((qty) => qty > 0);
    if (hasAny) {
      setDateSelections((prev) => ({ ...prev, [dateStr]: quantities }));
    } else {
      setDateSelections((prev) => {
        const next = { ...prev };
        delete next[dateStr];
        return next;
      });
    }
  };

  const hasDateSelected = Object.keys(dateSelections).length > 0;
  const isFormValid = name.trim() && address.trim() && phone.trim();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: { xs: 1.5, sm: 2 },
      maxWidth: 900,
      mx: 'auto',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* Step 0: Calendar */}
      {step === 0 && (
        <>
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', mb: 2 }}>
            <RentalCalendar
              equipment={equipment}
              dateSelections={dateSelections}
              reservations={reservations}
              isDateUnavailable={isDateUnavailable}
              onSaveDateSelection={handleSaveDateSelection}
            />
          </Box>
          <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size={isMobile ? 'medium' : 'large'}
              disabled={!hasDateSelected}
              onClick={() => setStep(1)}
            >
              Next
            </Button>
          </Box>
        </>
      )}

      {/* Step 1: Contact fields */}
      {step === 1 && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="Business (optional)"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                fullWidth
                size="small"
              />
            </Box>
            <TextField
              label="Mailing Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              size="small"
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="Additional Contact Info (optional)"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                fullWidth
                size="small"
              />
            </Box>
            <TextField
              label="Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              multiline
              rows={2}
              fullWidth
              size="small"
            />
          </Box>

          <Box sx={{ flexShrink: 0, display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size={isMobile ? 'medium' : 'large'}
              onClick={() => setStep(0)}
            >
              Back
            </Button>
            <Button
              variant="contained"
              size={isMobile ? 'medium' : 'large'}
              disabled={!isFormValid}
              onClick={() => setStep(2)}
              fullWidth={isMobile}
            >
              Review Contract
            </Button>
          </Box>
        </>
      )}

      {/* Step 2: Contract review + Formspree submit */}
      {step === 2 && (
        <ContractReviewStep
          name={name}
          business={business}
          address={address}
          phone={phone}
          contactInfo={contactInfo}
          comments={comments}
          dateSelections={dateSelections}
          equipment={equipment}
          onBack={() => setStep(1)}
          onGoHome={() => {
            setName('');
            setBusiness('');
            setAddress('');
            setPhone('');
            setContactInfo('');
            setComments('');
            setDateSelections({});
            setStep(0);
          }}
        />
      )}

    </Box>
  );
}

export default RentalsPage;
