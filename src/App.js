import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import Game from './components/Game';
import Auth from './components/Auth';
import Leaderboard from './components/Leaderboard';
import Notification from './components/Notification';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { blue, orange } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[700],
    },
    secondary: {
      main: orange[500],
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  overrides: {
    MuiButton: {
      root: {
        padding: '8px 16px',
      },
    },
    MuiCard: {
      root: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
});

const App = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  useEffect(() => {  
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get('/api/user');
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    showNotification('Logged out successfully', 'success');
    router.push('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Word Weaver
          </Typography>
          <Button color="inherit" component={Link} href="/game">Game</Button>
          <Button color="inherit" component={Link} href="/leaderboard">Leaderboard</Button>
          {user ? (
            <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <Button color="inherit" component={Link} href="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>

      <Container>
        <Notification message={notification.message} type={notification.type} />
        {router.pathname === '/' && <Game user={user} showNotification={showNotification} />}
        {router.pathname === '/login' && <Auth setUser={setUser} showNotification={showNotification} />}
        {router.pathname === '/game' && user ? (
          <Game user={user} showNotification={showNotification} />
        ) : (
          router.push('/login')
        )}
        {router.pathname === '/leaderboard' && <Leaderboard />}
      </Container>
    </ThemeProvider>
  );
};

export default App;