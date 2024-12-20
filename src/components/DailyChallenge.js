import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Box
} from '@material-ui/core';
import {
  EmojiEvents,
  Timer,
  Star,
  Lock,
  LockOpen,
  InfoOutlined,
  Refresh,
  CheckCircle,
  TrendingUp
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  challengeCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  },
  cardContent: {
    flexGrow: 1,
  },
  reward: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  progress: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  timer: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  completed: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
  },
  locked: {
    backgroundColor: theme.palette.action.disabledBackground,
  },
  difficultyChip: {
    marginRight: theme.spacing(1),
  },
  streakIndicator: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  streakIcon: {
    color: theme.palette.warning.main,
    marginRight: theme.spacing(1),
  },
  rewardBonus: {
    animation: '$pulse 1.5s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.1)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
  challengeStats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
  },
}));

const DifficultyColors = {
  Easy: '#4CAF50',
  Medium: '#FF9800',
  Hard: '#f44336',
  Expert: '#9C27B0'
};

const DAILY_CHALLENGES = [
  {
    id: 1,
    title: 'Speed Runner',
    description: 'Complete 5 words in under 2 minutes',
    reward: 500,
    type: 'speed',
    difficulty: 'Medium',
    progress: 0,
    target: 5,
    timeLimit: 120,
    unlocked: true,
    completedBy: 245,
    streak: 3,
  },
  {
    id: 2,
    title: 'Word Master',
    description: 'Complete 3 hard words without using hints',
    reward: 1000,
    type: 'skill',
    difficulty: 'Hard',
    progress: 0,
    target: 3,
    unlocked: true,
    completedBy: 120,
    streak: 0,
  },
  {
    id: 3,
    title: 'Category Champion',
    description: 'Complete all difficulties in one category',
    reward: 2000,
    type: 'achievement',
    difficulty: 'Expert',
    progress: 0,
    target: 4,
    unlocked: false,
    completedBy: 50,
    streak: 0,
  },
  {
    id: 4,
    title: 'Vocabulary Builder',
    description: 'Learn and complete 5 new words',
    reward: 750,
    type: 'learning',
    difficulty: 'Easy',
    progress: 0,
    target: 5,
    unlocked: true,
    completedBy: 180,
    streak: 2,
  },
];

const DailyChallenge = () => {
  const classes = useStyles();
  const [challenges, setChallenges] = useState(DAILY_CHALLENGES);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const msLeft = tomorrow - now;
      setTimeLeft(msLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = () => {
    if (!timeLeft) return '';
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleStartChallenge = (challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleCloseChallenge = () => {
    setSelectedChallenge(null);
  };

  const getRewardMultiplier = (streak) => {
    return streak > 0 ? streak * 0.1 + 1 : 1;
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h4" component="h1">
          Daily Challenges
          <IconButton onClick={() => setShowInfo(true)}>
            <InfoOutlined />
          </IconButton>
        </Typography>
        <div className={classes.timer}>
          <Timer />
          <Typography variant="subtitle1">
            Resets in: {formatTimeLeft()}
          </Typography>
        </div>
      </div>

      <Grid container spacing={3}>
        {challenges.map((challenge) => (
          <Grid item xs={12} sm={6} md={4} key={challenge.id}>
            <Card 
              className={`${classes.challengeCard} ${challenge.progress >= challenge.target ? classes.completed : ''} 
                ${!challenge.unlocked ? classes.locked : ''}`}
            >
              <CardContent className={classes.cardContent}>
                <Typography variant="h6" gutterBottom>
                  {challenge.title}
                  {challenge.streak > 0 && (
                    <Tooltip title={`${challenge.streak} day streak!`}>
                      <Box component="span" className={classes.streakIndicator}>
                        <TrendingUp className={classes.streakIcon} />
                        x{challenge.streak}
                      </Box>
                    </Tooltip>
                  )}
                </Typography>

                <Chip
                  size="small"
                  label={challenge.difficulty}
                  style={{ backgroundColor: DifficultyColors[challenge.difficulty], color: 'white' }}
                  className={classes.difficultyChip}
                />

                <Typography variant="body2" color="textSecondary">
                  {challenge.description}
                </Typography>

                <div className={classes.reward}>
                  <EmojiEvents color="secondary" />
                  <Typography 
                    variant="h6" 
                    className={challenge.streak > 0 ? classes.rewardBonus : ''}
                  >
                    {Math.floor(challenge.reward * getRewardMultiplier(challenge.streak))}
                  </Typography>
                </div>

                <LinearProgress
                  variant="determinate"
                  value={(challenge.progress / challenge.target) * 100}
                  className={classes.progress}
                  color={challenge.progress >= challenge.target ? "secondary" : "primary"}
                />
                
                <Typography variant="body2" color="textSecondary">
                  {challenge.progress}/{challenge.target} completed
                </Typography>

                <div className={classes.challengeStats}>
                  <Tooltip title="Players completed today">
                    <Box display="flex" alignItems="center">
                      <CheckCircle fontSize="small" style={{ marginRight: 8 }} />
                      {challenge.completedBy}
                    </Box>
                  </Tooltip>
                </div>
              </CardContent>

              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={challenge.unlocked ? <Star /> : <Lock />}
                  onClick={() => handleStartChallenge(challenge)}
                  disabled={!challenge.unlocked || challenge.progress >= challenge.target}
                >
                  {challenge.progress >= challenge.target ? 'Completed' : 
                   challenge.unlocked ? 'Start Challenge' : 'Locked'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={showInfo} onClose={() => setShowInfo(false)}>
        <DialogTitle>About Daily Challenges</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Complete daily challenges to earn extra rewards! Maintain your streak for bonus points.
          </Typography>
          <Typography paragraph>
            • Challenges reset every day at midnight
          </Typography>
          <Typography paragraph>
            • Maintain streaks to earn up to 50% bonus rewards
          </Typography>
          <Typography paragraph>
            • Some challenges require unlocking through achievements
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInfo(false)} color="primary">
            Got it!
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(selectedChallenge)} onClose={handleCloseChallenge}>
        <DialogTitle>{selectedChallenge?.title}</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            {selectedChallenge?.description}
          </Typography>
          {selectedChallenge?.timeLimit && (
            <Typography color="textSecondary">
              Time Limit: {selectedChallenge.timeLimit} seconds
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChallenge} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCloseChallenge} color="primary" variant="contained">
            Begin Challenge
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DailyChallenge;