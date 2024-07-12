import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import axios from 'axios';
import Game from './components/game';
import Auth from './components/Auth';
import Leaderboard from './components/Leaderboard';
import Notification from './components/Notification';
import AdComponent from './components/Adcomponent.js';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { blue, orange } from '@material-ui/core/colors';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box } from '@material-ui/core';
import { MobileAds } from 'react-native-google-mobile-ads';
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
  props: {
    MuiButton: {
      disableElevation: true,
    },
  },
});

const App = () => {
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
  };

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Word Weaver
            </Typography>
            <Button color="inherit" component={Link} to="/game">Game</Button>
            <Button color="inherit" component={Link} to="/leaderboard">Leaderboard</Button>
            {user ? (
              <Button color="inherit" onClick={logout}>Logout</Button>
            ) : (
              <Button color="inherit" component={Link} to="/login">Login</Button>
            )}
          </Toolbar>
        </AppBar>

        <Container>
          <Notification message={notification.message} type={notification.type} />

          <Switch>
            <Route 
              path="/login" 
              render={() => 
                user ? (
                  <Redirect to="/game" />
                ) : (
                  <Auth setUser={setUser} showNotification={showNotification} />
                )
              } 
            />
            <PrivateRoute 
              path="/game" 
              component={(props) => (
                <Game {...props} user={user} showNotification={showNotification} />
              )} 
            />
            <Route path="/leaderboard" component={Leaderboard} />
            <Redirect from="/" to="/game" />
          </Switch>

          <Box mt={4}>
            <AdComponent adSlot="5427959914" /> {/* Replace with your actual ad slot */}
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;