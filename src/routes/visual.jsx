import { Box } from '@mui/material';
import AnimateText from '../components/AnimateText';

function VisualPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <AnimateText
        text="Visual"
        variant="h1"
        color="primary"
        sx={{
          fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
        }}
      />
    </Box>
  );
}

export default VisualPage;
