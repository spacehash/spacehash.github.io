import { Box } from '@mui/material';
import AnimateText from '../components/AnimateText';

function AboutPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <AnimateText
        text="I'm a dude who does stuff"
        variant="h1"
        color="primary"
        sx={{
          fontSize: { xs: '1.5rem', sm: '2.5rem', md: '4rem' },
          textAlign: 'center',
          px: 2,
        }}
      />
    </Box>
  );
}

export default AboutPage;
