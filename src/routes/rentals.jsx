import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { parseCSV, parseUnavailableCSV } from '../utils/csv';
import { fillContractPdf } from '../utils/fillContractPdf';
import DatePickerWithHold from '../components/DatePickerWithHold';
import EquipmentTable from '../components/EquipmentTable';
import ContractPreviewModal from '../components/ContractPreviewModal';
import EmailPromptModal from '../components/EmailPromptModal';
import equipmentCsvUrl from '../resources/equipment.csv';
import unavailableCsvUrl from '../resources/unavailable.csv';

const EMAIL = 'spacehashes@gmail.com';

function RentalsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [equipment, setEquipment] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [dates, setDates] = useState([]);
  const [comments, setComments] = useState('');
  const [quantities, setQuantities] = useState({});
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

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

  const handleAddDate = (newDate) => {
    if (newDate && !isDateUnavailable(newDate) && !dates.some((d) => d.isSame(newDate, 'day'))) {
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

  const handleSubmit = async () => {
    const selectedItems = equipment.filter((item) => getQty(item.id) > 0);
    if (selectedItems.length === 0) return;

    try {
      const perDayTotal = selectedItems.reduce((sum, item) => sum + getQty(item.id) * item.cost, 0);

      const urls = await fillContractPdf({
        dates, selectedItems, getQty, name, business, address, phone, contactInfo, perDayTotal,
      });

      setPdfUrls(urls);
      setCurrentPdfIndex(0);
      setPdfModalOpen(true);
    } catch (err) {
      console.error('Failed to generate PDF preview:', err);
    }
  };

  const handleDownload = () => {
    // Download all PDFs
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
    pdfUrls.forEach((url, idx) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `contract-${safeName}-${dates[idx].format('YYYY-MM-DD')}.pdf`;
      link.click();
    });

    setPdfModalOpen(false);
    setEmailModalOpen(true);
  };

  const handleEmail = () => {
    setEmailModalOpen(false);

    const selectedItems = equipment.filter((item) => getQty(item.id) > 0);
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
  const isFormValid = hasSelections && name.trim() && address.trim() && phone.trim() && hasDates;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size={isMobile ? 'small' : 'medium'}
          />
          <TextField
            label="Business (optional)"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            fullWidth
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
        <TextField
          label="Mailing Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
          size={isMobile ? 'small' : 'medium'}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            size={isMobile ? 'small' : 'medium'}
          />
          <TextField
            label="Additional Contact Info (optional)"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            fullWidth
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
        <DatePickerWithHold
          dates={dates}
          onAddDate={handleAddDate}
          onRemoveDate={handleRemoveDate}
          onClearDates={() => setDates([])}
          isDateUnavailable={isDateUnavailable}
          isMobile={isMobile}
        />
      </Box>

      <EquipmentTable
        equipment={equipment}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
        isMobile={isMobile}
      />

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

      <ContractPreviewModal
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        onDownload={handleDownload}
        pdfUrls={pdfUrls}
        currentIndex={currentPdfIndex}
        onNavigate={setCurrentPdfIndex}
        isMobile={isMobile}
      />

      <EmailPromptModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onEmail={handleEmail}
        email={EMAIL}
        isMobile={isMobile}
      />
    </Box>
  );
}

export default RentalsPage;
