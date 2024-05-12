import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import { useAuth } from 'hooks/useAuth';
import { Sidenav as Sidebar } from 'layout/Sidebar';
import Header from 'layout/Header';
import { setAuth } from 'utils/setAuth';
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setAuth(user);
  });

  if (!user) {
    navigate('/', { replace: true });
  }

  if (user == 'null') {
    navigate('/', { replace: true });
  }

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Header authenticated={user ? true : false} />
      <Grid container sx={{ flexGrow: 1, height: '90%' }}>
        <Sidebar />

        <Grid
          item
          md={10}
          sx={{
            p: 6,
            backgroundColor: '#f9f9f9',
            flex: '1 !important',
            maxWidth: 'initial !important',
          }}
        >
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
}
