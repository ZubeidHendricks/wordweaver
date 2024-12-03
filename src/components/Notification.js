import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Notification = ({ message, type }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar open={Boolean(message)} autoHideDuration={6000}>
        <Alert severity={type || 'info'}>{message}</Alert>
      </Snackbar>
    </div>
  );
};

export default Notification;