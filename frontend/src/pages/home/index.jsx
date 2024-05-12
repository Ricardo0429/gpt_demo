import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Grid,
  Box,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';

import {
  GoogleLoginButton,
  MicrosoftLoginButton,
} from 'react-social-login-buttons';

import Header from 'layout/Header';
import { useAuth } from 'hooks/useAuth';

export default function Home() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const { login } = useAuth();

  const handleClick = () => {
    login({ email, password: pwd });
  };

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;

      case 'pwd':
        setPwd(e.target.value);
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
              borderRight: '4px solid gray',
            }}
          >
            <FormGroup>
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
              <FormControlLabel
                sx={{
                  my: 6,
                  '&:focus': {
                    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
                  },
                }}
                control={<Checkbox defaultChecked size="large" />}
                label="Remember Me"
              />
            </FormGroup>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#f74780',
                fontSize: '2rem',
                textTransform: 'none',
                fontWeight: 700,
                mb: 6,
                px: 8,
                '&:hover': {
                  backgroundColor: '#f74780',
                },
              }}
              onClick={handleClick}
            >
              Sign In
            </Button>
            <p>
              Don't have an account?{' '}
              <Link to="/sign-up" className="underline">
                Sign Up
              </Link>
            </p>
          </Grid>
          <Grid
            item
            md={6}
            sm={12}
            sx={{
              px: 24,
              pt: 6,
            }}
          >
            <Box sx={{ mt: 6 }}>
              <GoogleLoginButton onClick={handleClick} className="mt-40" />
            </Box>
            <Box sx={{ mt: 6 }}>
              <MicrosoftLoginButton onClick={handleClick} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
