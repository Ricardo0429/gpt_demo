import { useState } from 'react';

import { Button, Grid, Box, TextField, FormGroup } from '@mui/material';

import Header from 'layout/Header';
import { useAuth } from 'hooks/useAuth';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const { register } = useAuth();

  const handleClick = () => {
    register({ name, email, password: pwd });
  };

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;

      case 'pwd':
        setPwd(e.target.value);
        break;

      case 'name':
        setName(e.target.value);
        break;

      default:
        break;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Header />
      <Box sx={{ height: '80%' }}>
        <p className="text-4xl p-12 font-black text-center">
          Welcome to a new era of storytelling!
        </p>
        <Grid container>
          <Grid
            item
            md={6}
            sm={12}
            sx={{
              px: 24,
              pt: 6,
            }}
          >
            <FormGroup>
              <div className="input-field mb-4">
                <p className="mb-4">User Name</p>
                <TextField
                  fullWidth
                  id="fullWidth"
                  value={name}
                  name="name"
                  onChange={handleChange}
                />
              </div>
              <div className="input-field mb-4">
                <p className="mb-4">Email Address</p>
                <TextField
                  fullWidth
                  id="fullWidth"
                  value={email}
                  name="email"
                  onChange={handleChange}
                />
              </div>
              <div className="input-field">
                <p className="mb-4">Password</p>
                <TextField
                  fullWidth
                  id="fullWidth"
                  name="pwd"
                  value={pwd}
                  onChange={handleChange}
                />
              </div>
            </FormGroup>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#f74780',
                fontSize: '2rem',
                textTransform: 'none',
                fontWeight: 700,
                my: 6,
                px: 8,
                '&:hover': {
                  backgroundColor: '#f74780',
                },
              }}
              onClick={handleClick}
            >
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
