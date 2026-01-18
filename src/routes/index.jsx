import { Box } from '@mui/material';
import AnimateText from '../components/AnimateText';

function HomePage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <AnimateText text="Hello World" variant="h1" color="primary" />
    </Box>
  );
}

export default HomePage;
