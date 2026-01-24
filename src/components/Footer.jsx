import { Box, Link } from '@mui/material';
import { Link as RouterLink } from '@tanstack/react-router';

function Footer() {
  return (
    <Box display="flex" justifyContent="center" gap={2} py={2}>
      <Link component={RouterLink} to="/home" fontSize="small">
        home
      </Link>
      <Link component={RouterLink} to="/about" fontSize="small">
        about
      </Link>
      <Link component={RouterLink} to="/rentals" fontSize="small">
        rentals
      </Link>
    </Box>
  );
}

export default Footer;
