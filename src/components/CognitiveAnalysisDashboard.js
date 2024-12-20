import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Button,
  IconButton,
  Tooltip
} from '@material-ui/core';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Psychology,
  Speed,
  FitnessCenter,
  School,
  Timeline,
  BarChart
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4]
    }
  },
  chartContainer: {
    height: 300,
    marginTop: theme.spacing(2)
  },
  metricChip: {
    margin: theme.spacing(0.5),
    '& .MuiChip-icon': {
      color: 'inherit'
    }
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1)
  },
  trendIcon: {
    marginLeft: theme.spacing(1)
  },
  positive: {
    color: theme.palette.success.main
  },
  negative: {
    color: theme.palette.error.main
  },
  neutral: {
    color: theme.palette.info.main
  }
}));

const CognitiveAnalysisDashboard = ({ cognitiveData, performanceHistory }) => {
  const classes = useStyles();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (cognitiveData && performanceHistory) {
      const processedMetrics = processMetrics(cognitiveData, performanceHistory);
      setMetrics(processedMetrics);
    }
  }, [cognitiveData, performanceHistory]);

  const processMetrics = (cognitive, history) => {
    return {
      cognitiveLoad: calculateCognitiveLoadTrend(history),
      learningRate: calculateLearningRate(history),
      skillMastery: calculateSkillMastery(cognitive),
      performanceTrend: calculatePerformanceTrend(history),
      adaptationScore: calculateAdaptationScore(cognitive),
      predictions: generatePredictions(cognitive, history)
    };
  };

  const renderCognitiveLoadChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={metrics.cognitiveLoad} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <RechartsTooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="total"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="memory"
          stackId="1"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="processing"
          stackId="1"
          stroke="#ffc658"
          fill="#ffc658"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderSkillRadar = () => (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart outerRadius={90} data={metrics.skillMastery}>
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar
          name="Current Skills"
          dataKey="value"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name="Potential"
          dataKey="potential"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.3}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );

  const renderPerformanceTrend = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={metrics.performanceTrend}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <RechartsTooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="accuracy"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="speed"
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  if (!metrics) return <LinearProgress />;

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cognitive Load Analysis
                <Tooltip title="Real-time measurement of mental effort">
                  <IconButton size="small">
                    <Psychology />
                  </IconButton>
                </Tooltip>
              </Typography>
              {renderCognitiveLoadChart()}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Mastery Profile
                <Tooltip title="Current skill levels and potential">
                  <IconButton size="small">
                    <FitnessCenter />
                  </IconButton>
                </Tooltip>
              </Typography>
              {renderSkillRadar()}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Learning Progress
                <Tooltip title="Performance trends and predictions">
                  <IconButton size="small">
                    <School />
                  </IconButton>
                </Tooltip>
              </Typography>
              {renderPerformanceTrend()}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Insights & Recommendations
              </Typography>
              <Grid container spacing={2}>
                {metrics.predictions.map((prediction, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Paper style={{ padding: '16px' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {prediction.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {prediction.description}
                      </Typography>
                      <div style={{ marginTop: '8px' }}>
                        <Chip
                          icon={<Timeline />}
                          label={`Confidence: ${prediction.confidence}%`}
                          className={classes.metricChip}
                          color="primary"
                          variant="outlined"
                        />
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CognitiveAnalysisDashboard;