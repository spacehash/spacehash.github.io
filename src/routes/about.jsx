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
      <AnimateText text="fuck you, nosey ass" variant="h1" color="primary" />
    </Box>
  );
}

export default AboutPage;
