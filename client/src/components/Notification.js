import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Notification = ({ message, type }) => {
  return (
    <Snackbar open={Boolean(message)} autoHideDuration={3000}>
      <Alert severity={type || 'info'}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;