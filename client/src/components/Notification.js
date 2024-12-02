import React from 'react';
import { Snackbar, Alert } from '@material-ui/core';

const Notification = ({ message, type }) => {
  return (
    <Snackbar open={Boolean(message)} autoHideDuration={3000}>
      <Alert severity={type || 'info'} elevation={6} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;