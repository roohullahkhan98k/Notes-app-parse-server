import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const Layout = ({ children,role }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role={role} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
