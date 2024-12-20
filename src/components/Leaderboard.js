import React, { useState } from 'react';

const MOCK_DATA = {
  daily: [
    { id: 1, name: 'WordMaster', score: 2500, achievements: 8, streak: 12 },
    { id: 2, name: 'Lexicon', score: 2200, achievements: 6, streak: 8 },
    { id: 3, name: 'WordWizard', score: 2100, achievements: 5, streak: 7 },
    { id: 4, name: 'Spellbound', score: 2000, achievements: 4, streak: 6 },
    { id: 5, name: 'Scrabbler', score: 1900, achievements: 3, streak: 5 }
  ],
  weekly: [
    { id: 1, name: 'VocabKing', score: 15000, achievements: 15, streak: 30 },
    { id: 2, name: 'Wordsmith', score: 12500, achievements: 12, streak: 25 },
    { id: 3, name: 'Linguist', score: 11000, achievements: 10, streak: 20 },
    { id: 4, name: 'Polyglot', score: 10000, achievements: 8, streak: 15 },
    { id: 5, name: 'Scholar', score: 9000, achievements: 6, streak: 10 }
  ],
  allTime: [
    { id: 1, name: 'Legend', score: 50000, achievements: 25, streak: 50 },
    { id: 2, name: 'Champion', score: 45000, achievements: 22, streak: 45 },
    { id: 3, name: 'Master', score: 40000, achievements: 20, streak: 40 },
    { id: 4, name: 'Expert', score: 35000, achievements: 18, streak: 35 },
    { id: 5, name: 'Veteran', score: 30000, achievements: 16, streak: 30 }
  ]
};

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState('daily');
  const [loading, setLoading] = useState(false);

  const getTimeframeData = () => {
    return MOCK_DATA[timeframe] || [];
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return { backgroundColor: '#FFD700' };
      case 2:
        return { backgroundColor: '#C0C0C0' };
      case 3:
        return { backgroundColor: '#CD7F32' };
      default:
        return {};
    }
  };

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
        <div className="timeframe-buttons">
          <button
            className={timeframe === 'daily' ? 'active' : ''}
            onClick={() => setTimeframe('daily')}
          >
            Daily
          </button>
          <button
            className={timeframe === 'weekly' ? 'active' : ''}
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </button>
          <button
            className={timeframe === 'allTime' ? 'active' : ''}
            onClick={() => setTimeframe('allTime')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="leaderboard-content">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
              <th>Achievements</th>
              <th>Streak</th>
            </tr>
          </thead>
          <tbody>
            {getTimeframeData().map((player, index) => (
              <tr key={player.id} className="player-row">
                <td>
                  <span className="rank" style={getRankStyle(index + 1)}>
                    {index + 1}
                  </span>
                </td>
                <td className="player-name">{player.name}</td>
                <td className="score">{player.score.toLocaleString()}</td>
                <td className="achievements">{player.achievements}</td>
                <td className="streak">{player.streak}🔥</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .leaderboard {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .leaderboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .timeframe-buttons {
          display: flex;
          gap: 10px;
        }

        .timeframe-buttons button {
          padding: 8px 16px;
          border: 2px solid #2196f3;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .timeframe-buttons button.active {
          background: #2196f3;
          color: white;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background: #f5f5f5;
          font-weight: bold;
        }

        .player-row:hover {
          background: #f8f9fa;
        }

        .rank {
          display: inline-block;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 50%;
          font-weight: bold;
        }

        .player-name {
          font-weight: 500;
        }

        .score {
          color: #2196f3;
          font-weight: bold;
        }

        .achievements {
          color: #4caf50;
        }

        .streak {
          color: #ff9800;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;