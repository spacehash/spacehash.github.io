import { useState, useEffect, useRef } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon   from '@mui/icons-material/NavigateNext';
import AddIcon            from '@mui/icons-material/Add';
import RemoveIcon         from '@mui/icons-material/Remove';
import CRTDialog       from './CRTDialog';
import SlidingHologram from './hologram/SlidingHologram';
import SlidingPillNav  from './SlidingPillNav';

// ─── Qty +/− control ──────────────────────────────────────────────────────────

function QtyControl({ qty, availableQty, onDecrement, onIncrement }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        size="small"
        onClick={onDecrement}
        disabled={qty <= 0}
        sx={{ width: 36, height: 36, border: 1, borderColor: 'primary.main', color: 'primary.main' }}
      >
        <RemoveIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Typography
        sx={{ minWidth: 32, textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: 'primary.main' }}
      >
        {qty}
      </Typography>
      <IconButton
        size="small"
        onClick={onIncrement}
        disabled={qty >= availableQty}
        sx={{ width: 36, height: 36, border: 1, borderColor: 'primary.main', color: 'primary.main' }}
      >
        <AddIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}

// ─── Navigation arrow button ───────────────────────────────────────────────────

function NavArrow({ onClick, side, children }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position:        'absolute',
        [side]:           12,
        top:             '42%',
        transform:       'translateY(-50%)',
        zIndex:          2,
        color:           'primary.main',
        bgcolor:         'rgba(0,0,0,0.35)',
        backdropFilter:  'blur(8px)',
        border:          '1px solid',
        borderColor:     'rgba(0,255,65,0.25)',
        transition:      'background-color 0.2s ease',
        '&:hover':       { bgcolor: 'rgba(0,255,65,0.12)' },
      }}
    >
      {children}
    </IconButton>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

function DateGearModal({ open, date, equipment, reservations, initialQuantities, onSave, onCancel }) {
  const [quantities,       setQuantities]       = useState({});
  const [activeItemIndex,  setActiveItemIndex]  = useState(0);
  const [swipeNav,         setSwipeNav]         = useState(false);
  const dialogRef    = useRef(null);
  const directionRef = useRef('next');
  const swipeRef     = useRef(null); // { x, y, t } at pointerdown

  useEffect(() => {
    if (open) {
      setQuantities(initialQuantities || {});
      setActiveItemIndex(0);
    }
  }, [open]); // eslint-disable-line

  if (!date || !equipment.length) return null;

  const dateStr        = date.format('YYYY-MM-DD');
  const reservedForDate = reservations[dateStr] || {};

  // Active item derived values
  const activeItem    = equipment[activeItemIndex];
  const reservedQty   = reservedForDate[activeItem.name] || 0;
  const availableQty  = Math.max(0, activeItem.maxQty - reservedQty);
  const isUnavailable = availableQty === 0;
  const qty           = quantities[activeItem.id] || 0;
  const lineTotal     = qty > 0 ? qty * activeItem.cost : null;

  // direction mirrors the pill's slide direction:
  //   'next' → pill moves right (higher index) → hologram exits right, enters from left
  //   'prev' → pill moves left  (lower  index) → hologram exits left,  enters from right
  const goPrev = (spin = false) => {
    setSwipeNav(spin);
    directionRef.current = 'prev';
    setActiveItemIndex(i => (i - 1 + equipment.length) % equipment.length);
  };
  const goNext = (spin = false) => {
    setSwipeNav(spin);
    directionRef.current = 'next';
    setActiveItemIndex(i => (i + 1) % equipment.length);
  };
  const handlePillChange = (newIndex) => {
    setSwipeNav(false);
    directionRef.current = newIndex > activeItemIndex ? 'next' : 'prev';
    setActiveItemIndex(newIndex);
  };

  const handleQtyChange = (newQty) => {
    const clamped = Math.min(availableQty, Math.max(0, parseInt(newQty) || 0));
    setQuantities(prev => ({ ...prev, [activeItem.id]: clamped }));
  };

  // Swipe-to-navigate on the hologram stage.
  // Only triggers on a fast horizontal flick — slow drags fall through to OrbitControls.
  const SWIPE_MIN_PX  = 30;   // minimum horizontal travel
  const SWIPE_MIN_VEL = 0.35; // px/ms — below this it's an orbit drag, not a swipe

  const handleStagePointerDown = (e) => {
    swipeRef.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
  };
  const handleStagePointerUp = (e) => {
    if (!swipeRef.current) return;
    const dx = e.clientX - swipeRef.current.x;
    const dy = e.clientY - swipeRef.current.y;
    const dt = e.timeStamp  - swipeRef.current.t;
    swipeRef.current = null;

    const vx = Math.abs(dx) / dt;
    if (vx < SWIPE_MIN_VEL || Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0) goNext(true); else goPrev(true);
  };

  return (
    <CRTDialog ref={dialogRef} open={open} onClose={onCancel} maxWidth="sm" fullWidth>

      <DialogTitle sx={{ pb: 0.5 }}>
        {date.format('dddd, MMMM D, YYYY')}
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>

        {/* ── Hologram stage ── */}
        <Box
          sx={{ position: 'relative', height: { xs: 260, sm: 320 } }}
          onPointerDown={handleStagePointerDown}
          onPointerUp={handleStagePointerUp}
          onPointerCancel={() => { swipeRef.current = null; }}
        >
          <SlidingHologram
            itemName={activeItem.name}
            direction={directionRef.current}
            qty={qty}
            swipeTriggered={swipeNav}
            height="100%"
          />

          <NavArrow onClick={goPrev} side="left">
            <NavigateBeforeIcon />
          </NavArrow>
          <NavArrow onClick={goNext} side="right">
            <NavigateNextIcon />
          </NavArrow>
        </Box>

        {/* ── Controls — fixed height so the modal never resizes ── */}
        <Box
          sx={{
            height:         176,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            1.5,
            px:             2,
            overflow:       'hidden',
            borderTop:      '1px solid',
            borderColor:    'rgba(0,255,65,0.15)',
          }}
        >
          {/* Item name + daily cost — noWrap prevents reflowing */}
          <Box sx={{ textAlign: 'center', maxWidth: '100%' }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                color:          'primary.main',
                fontWeight:     600,
                textDecoration: isUnavailable ? 'line-through' : 'none',
                lineHeight:     1.2,
              }}
            >
              {activeItem.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              ${activeItem.cost}/day
              {reservedQty > 0 && ` · ${reservedQty} of ${activeItem.maxQty} reserved`}
              {lineTotal   !== null && ` · $${lineTotal} today`}
            </Typography>
          </Box>

          {/* Fixed-height slot — prevents layout shift between qty and unavailable */}
          <Box sx={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isUnavailable ? (
              <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                Unavailable on this date
              </Typography>
            ) : (
              <QtyControl
                qty={qty}
                availableQty={availableQty}
                onDecrement={() => handleQtyChange(qty - 1)}
                onIncrement={() => handleQtyChange(qty + 1)}
              />
            )}
          </Box>

          {/* Gear selector pill */}
          <SlidingPillNav
            items={equipment.map(e => e.name)}
            activeIndex={activeItemIndex}
            onChange={handlePillChange}
            dense
          />
        </Box>

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
