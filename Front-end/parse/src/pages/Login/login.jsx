import  { useState, useEffect } from 'react';
import Parse from '../../parseConfig';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Stack,
} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = Parse.User.current();
    if (currentUser && currentUser.get('role') === 'admin') {
      Parse.User.logOut();
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const currentUser = Parse.User.current();
      if (currentUser && currentUser.get('role') === 'admin') {
        Parse.User.logOut();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogin = async () => {
    try {
      const response = await Parse.Cloud.run('login', { email, password });
      await Parse.User.become(response.sessionToken);

      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" mb={3} align="center">
          Welcome Back
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

          <Button variant="contained" color="primary" size="large" onClick={handleLogin} fullWidth>
            Login
          </Button>

          <Button
            variant="text"
            color="secondary"
            onClick={() => navigate('/signup')}
            fullWidth
          >
            Don't have an account? Sign Up
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
