import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from '@material-ui/core';

// Word list for daily challenges
const WORD_LISTS = {
  easy: ['HELLO', 'WORLD', 'BRAVE', 'SMART', 'CLOWN'],
  medium: ['PUZZLE', 'KNIGHT', 'FLAME', 'DRONE', 'CHASE'],
  hard: ['RHYTHM', 'ZEPHYR', 'QUARTZ', 'JIGSAW', 'SPHINX']
};