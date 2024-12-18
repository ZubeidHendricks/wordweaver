import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Select,
  MenuItem,
  Tooltip
} from '@material-ui/core';
import { ShareOutlined, HelpOutline } from '@material-ui/icons';

// Enhanced word lists with definitions and origins
const WORD_DICTIONARY = {
  'HELLO': { 
    definition: 'Used as a greeting',
    origin: 'Middle English, from Old English "hāl" meaning "whole"'
  },
  'WORLD': { 
    definition: 'The earth, together with all of its countries and peoples',
    origin: 'Old English "weorold", meaning age of man'
  }
};