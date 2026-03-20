import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Dialog } from '@mui/material';

const ENTER_MS = 1120;
const EXIT_MS  = 500;

const OPEN_FRAMES = [
  { clipPath: 'inset(calc(50% - 1px) 0 calc(50% - 1px) 0)', filter: 'brightness(8) blur(3px)' },
  { clipPath: 'inset(15% 0 15% 0)',                          filter: 'brightness(2)',           offset: 0.32 },
  { clipPath: 'inset(-3% 0 -3% 0)',                          filter: 'brightness(1.3)',          offset: 0.62 },
  { clipPath: 'inset(1% 0 1% 0)',                            filter: 'brightness(1.05)',         offset: 0.82 },
  { clipPath: 'inset(0% 0 0% 0)',                            filter: 'brightness(1)' },
];

const CLOSE_FRAMES = [
  { clipPath: 'inset(0% 0 0% 0)',                            filter: 'brightness(1)' },
  { clipPath: 'inset(1% 0 1% 0)',                            filter: 'brightness(1.05)',         offset: 0.18 },
  { clipPath: 'inset(15% 0 15% 0)',                          filter: 'brightness(2)',            offset: 0.50 },
  { clipPath: 'inset(49% 0 49% 0)',                          filter: 'brightness(5) blur(2px)',  offset: 0.82 },
  { clipPath: 'inset(calc(50% - 1px) 0 calc(50% - 1px) 0)', filter: 'brightness(0)' },
];

/**
 * Drop-in replacement for MUI Dialog with a CRT terminal open/close animation.
 *
 * Usage:
 *   const dialogRef = useRef(null);
 *   <CRTDialog ref={dialogRef} open={open} onClose={handleClose} ...>
 *     <Button onClick={() => dialogRef.current?.close(handleClose)}>Cancel</Button>
 *   </CRTDialog>
 *
 * ref.close(callback) — plays the close animation, then calls callback().
 * onClose             — called automatically when the backdrop/Escape is clicked.
 */
const CRTDialog = forwardRef(function CRTDialog(
  { open, onClose, children, ...dialogProps },
  ref
) {
  const [internalOpen, setInternalOpen] = useState(false);
  const paperRef   = useRef(null);
  const animRef    = useRef(null);
  const closingRef = useRef(false);

  // Mount when parent opens
  useEffect(() => {
    if (open) {
      closingRef.current = false;
      setInternalOpen(true);
    }
  }, [open]);

  // Play close animation then call afterClose
  const runClose = useCallback((afterClose) => {
    if (closingRef.current) return;
    closingRef.current = true;

    const paper = paperRef.current;
    if (!paper) {
      setInternalOpen(false);
      afterClose?.();
      return;
    }

    if (animRef.current) { animRef.current.cancel(); animRef.current = null; }

    const anim = paper.animate(CLOSE_FRAMES, {
      duration: EXIT_MS,
      easing: 'ease-in',
      fill: 'both',
    });
    animRef.current = anim;

    anim.addEventListener('finish', () => {
      animRef.current = null;
      setInternalOpen(false);
      afterClose?.();
    });
  }, []);

  // Expose close() to parent via ref
  useImperativeHandle(ref, () => ({ close: runClose }), [runClose]);

  // Callback ref on Paper — starts open animation when Paper mounts
  const setPaperRef = useCallback((el) => {
    paperRef.current = el;
    if (!el) return;

    if (animRef.current) { animRef.current.cancel(); animRef.current = null; }

    requestAnimationFrame(() => {
      const anim = el.animate(OPEN_FRAMES, {
        duration: ENTER_MS,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
        fill: 'both',
      });
      animRef.current = anim;
      anim.addEventListener('finish', () => {
        if (animRef.current === anim) animRef.current = null;
      });
    });
  }, []);

  return (
    <Dialog
      open={internalOpen}
      onClose={() => runClose(onClose)}
      TransitionProps={{ timeout: 0 }}
      PaperProps={{
        ref: setPaperRef,
        sx: {
          border: '1px solid',
          borderColor: 'primary.main',
          boxShadow: '0 0 40px rgba(0,255,65,0.15), 0 0 0 1px rgba(0,255,65,0.1)',
        },
      }}
      {...dialogProps}
    >
      {children}
    </Dialog>
  );
});

export default CRTDialog;
