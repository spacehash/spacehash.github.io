import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { parseCSV, parseReservationsCSV } from '../utils/csv';
import { fillContractPdf } from '../utils/fillContractPdf';
import RentalCalendar from '../components/RentalCalendar';
import EmailPromptModal from '../components/EmailPromptModal';
import equipmentCsvUrl from '../resources/equipment.csv';
import reservationsCsvUrl from '../resources/reservations.csv';

const EMAIL = 'spacehashes@gmail.com';

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
  const [pdfUrls, setPdfUrls] = useState([]);
  const [pdfDates, setPdfDates] = useState([]);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
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

  const handleSubmit = async () => {
    const entries = Object.entries(dateSelections);
    if (entries.length === 0) return;

    try {
      const sortedEntries = entries.sort(([a], [b]) => a.localeCompare(b));
      const dateEntries = sortedEntries.map(([dateStr, qtys]) => {
        const date = dayjs(dateStr);
        const selectedItems = equipment.filter((e) => (qtys[e.id] || 0) > 0);
        const getQty = (id) => qtys[id] || 0;
        const perDayTotal = selectedItems.reduce((sum, item) => sum + getQty(item.id) * item.cost, 0);
        return { date, selectedItems, getQty, perDayTotal };
      });
      const sortedDateStrs = sortedEntries.map(([dateStr]) => dateStr);

      const urls = await fillContractPdf({
        dateEntries, name, business, address, phone, contactInfo,
      });

      setPdfUrls(urls);
      setPdfDates(sortedDateStrs);
      setEmailModalOpen(true);
    } catch (err) {
      console.error('Failed to generate contracts:', err);
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

      {/* Step 1: Calendar */}
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

      {/* Step 2: Contact fields */}
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
              onClick={handleSubmit}
              fullWidth={isMobile}
            >
              Submit Request
            </Button>
          </Box>
        </>
      )}

      <EmailPromptModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        email={EMAIL}
        pdfUrls={pdfUrls}
        pdfDates={pdfDates}
        clientName={name}
      />
    </Box>
  );
}

export default RentalsPage;
