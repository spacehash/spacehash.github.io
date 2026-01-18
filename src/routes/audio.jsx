import { Box } from '@mui/material';
import tracksFile from '../tracks.txt';
import { useState, useEffect } from 'react';
import { useThemeMode } from '../context/ThemeContext';

function AudioPage() {
  const [tracks, setTracks] = useState([]);
  const { mode } = useThemeMode();

  // Load track URLs from tracks.txt on mount
  useEffect(() => {
    fetch(tracksFile)
      .then((res) => res.text())
      .then((text) => {
        const urls = text
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        setTracks(urls);
      });
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      maxWidth="800px"
      mx="auto"
      height="100%"
      gap={3}
      py={4}
      px={2}
      sx={{
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: 8,
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#333',
          borderRadius: 4,
        },
      }}
    >
      {tracks.map((url, index) => (
        <Box key={`${index}-${mode}`} width="100%" flexShrink={0}>
          <iframe
            title={`Track ${index + 1}`}
            width="100%"
            height="300"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23242424&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`}
          />
        </Box>
      ))}
    </Box>
  );
}

export default AudioPage;
