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
  MenuItem
} from '@material-ui/core';

// Comprehensive word lists with varied difficulty
const WORD_LISTS = {
  easy: ['HELLO', 'WORLD', 'BRAVE', 'SMART', 'CLOWN', 'HOUSE', 'APPLE', 'BEACH'],
  medium: ['PUZZLE', 'KNIGHT', 'FLAME', 'DRONE', 'CHASE', 'GLIDE', 'SPARK', 'MUSIC'],
  hard: ['RHYTHM', 'ZEPHYR', 'QUARTZ', 'JIGSAW', 'SPHINX', 'WALTZ', 'GLYPH', 'CRYPT']
};