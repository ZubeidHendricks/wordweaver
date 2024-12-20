import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper, Typography, Container, Link as MuiLink } from '@material-ui/core';
import Link from 'next/link';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  toggleButton: {
    marginTop: theme.spacing(2),
  },
  forgotPassword: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
  },
}));

const Auth = ({ setUser, showNotification }) => {
  const classes = useStyles();
  const [isLogin, setIsLogin] = useState(false);  // Start with registration form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `/api/auth/${isLogin ? 'login' : 'register'}`;
      console.log('Making request to:', url);
      console.log('Request payload:', { username, password });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Server returned invalid JSON');
      }

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      showNotification(`Successfully ${isLogin ? 'logged in' : 'registered'}!`, 'success');
    } catch (error) {
      console.error('Auth error:', error);
      showNotification(error.message || 'An error occurred', 'error');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          {isLogin ? 'Login' : 'Register'}
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
          {isLogin ? 'Please login to continue' : 'Create a new account to start playing'}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isLogin && (
            <div className={classes.forgotPassword}>
              <Link href="/forgot-password">
                <MuiLink component="a" variant="body2" color="primary" style={{ cursor: 'pointer' }}>
                  Forgot Password?
                </MuiLink>
              </Link>
            </div>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
          <Button
            fullWidth
            color="secondary"
            className={classes.toggleButton}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need to register?' : 'Already have an account?'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;