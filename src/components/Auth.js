import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';

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
}));