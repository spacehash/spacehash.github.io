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
      <AnimateText
        text="Hello World"
        variant="h1"
        color="primary"
        sx={{
          fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
        }}
      />
    </Box>
  );
}

export default HomePage;
