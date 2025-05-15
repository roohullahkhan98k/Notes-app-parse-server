import React, { useState } from 'react';
import Parse from '../../parseConfig';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Stack,
} from '@mui/material';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await Parse.Cloud.run('signup', { email, password });
      await Parse.User.become(response.sessionToken);
      alert('Success: ' + response.message);
      navigate('/home');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" mb={3} align="center">
          Create Your Account
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button variant="contained" color="primary" size="large" onClick={handleSignup} fullWidth>
            Sign Up
          </Button>

          <Button
            variant="text"
            color="secondary"
            onClick={() => navigate('/')}
            fullWidth
          >
            Already have an account? Log In
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Signup;
