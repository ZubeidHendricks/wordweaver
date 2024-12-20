import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CognitiveMetrics = ({ metrics }) => {
  const {
    learningRate,
    performanceHistory,
    skillMastery,
    adaptationScore,
    predictions
  } = metrics;

  return (
    <div className="metrics-container">
      <div className="metrics-header">
        <h2>Cognitive Performance Analysis</h2>
        <div className="current-stats">
          <div className="stat-item">
            <span className="stat-label">Learning Rate</span>
            <span className="stat-value">
              {(learningRate.current * 100).toFixed(1)}%
              {learningRate.trend > 0 ? '↑' : '↓'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mastery Level</span>
            <span className="stat-value">
              {(skillMastery.overall * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Learning Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
                name="Performance Score"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
                strokeDasharray="5 5"
                name="Predicted Performance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Skill Mastery</h3>
          <div className="mastery-grid">
            {Object.entries(skillMastery.skills).map(([skill, level]) => (
              <div key={skill} className="mastery-item">
                <div className="skill-name">{skill}</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ 
                      width: `${level * 100}%`,
                      backgroundColor: getProgressColor(level)
                    }}
                  />
                </div>
                <div className="level-text">{(level * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Adaptation Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={adaptationScore.history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                name="Adaptation Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Performance Predictions</h3>
          <div className="predictions-grid">
            {Object.entries(predictions).map(([term, pred]) => (
              <div key={term} className="prediction-item">
                <h4>{formatTerm(term)}</h4>
                <div className="prediction-stats">
                  <div className="stat">
                    <span>Score:</span>
                    <span>{(pred.score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="stat">
                    <span>Confidence:</span>
                    <span>{(pred.confidence * 100).toFixed(1)}%</span>
                  </div>
                  {pred.timeToAchieve && (
                    <div className="stat">
                      <span>Time to Achieve:</span>
                      <span>{formatTime(pred.timeToAchieve)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .metrics-container {
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .metrics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .current-stats {
          display: flex;
          gap: 20px;
        }

        .stat-item {
          background: white;
          padding: 10px 20px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-label {
          display: block;
          font-size: 0.9rem;
          color: #666;
        }

        .stat-value {
          display: block;
          font-size: 1.2rem;
          font-weight: bold;
          color: #2196f3;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .chart-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .mastery-grid {
          display: grid;
          gap: 15px;
        }

        .mastery-item {
          display: grid;
          grid-template-columns: 120px 1fr 50px;
          align-items: center;
          gap: 10px;
        }

        .progress-bar {
          height: 8px;
          background: #eee;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .predictions-grid {
          display: grid;
          gap: 15px;
        }

        .prediction-item {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .prediction-stats {
          display: grid;
          gap: 8px;
          margin-top: 10px;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          color: #666;
        }
      `}</style>
    </div>
  );
};

// Helper functions
const getProgressColor = (level) => {
  if (level >= 0.8) return '#4caf50';
  if (level >= 0.6) return '#2196f3';
  if (level >= 0.4) return '#ff9800';
  return '#f44336';
};

const formatTerm = (term) => {
  return term.replace(/([A-Z])/g, ' $1').toLowerCase();
};

const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export default CognitiveMetrics;