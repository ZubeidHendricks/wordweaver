import React from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { blue, orange } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Notification from '../src/components/Notification';
import { useEffect, useState } from 'react';

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

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    // Check authentication
    const token = localStorage?.getItem('token');
    if (token && !user) {
      fetchUserData(token);
    } else if (!token && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [router.pathname]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      router.push('/login');
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

  if (typeof window === 'undefined') {
    return null; // Prevent server-side rendering
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Word Weaver
          </Typography>
          <Link href="/game" passHref>
            <Button color="inherit" component="a">Game</Button>
          </Link>
          <Link href="/leaderboard" passHref>
            <Button color="inherit" component="a">Leaderboard</Button>
          </Link>
          {user ? (
            <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <Link href="/login" passHref>
              <Button color="inherit" component="a">Login</Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>

      <Container>
        <Notification message={notification.message} type={notification.type} />
        <Component {...pageProps} user={user} setUser={setUser} showNotification={showNotification} />
      </Container>
    </ThemeProvider>
  );
}

export default MyApp;