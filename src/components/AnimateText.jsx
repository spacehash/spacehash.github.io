import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

function AnimateText({ text, ...typographyProps }) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Typing animation: reveals text one character at a time
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  // Blinking cursor: toggles cursor visibility every 500ms
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <Typography {...typographyProps}>
      {displayedText}
      <Box
        component="span"
        sx={{
          opacity: showCursor ? 1 : 0,
          ml: 0.5,
        }}
      >
        |
      </Box>
    </Typography>
  );
}

export default AnimateText;
