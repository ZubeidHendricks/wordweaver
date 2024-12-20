    const hintTypes = [
      `The word has ${currentWord.length} letters`,
      `The word starts with '${currentWord[0]}'`,
      `The word ends with '${currentWord[currentWord.length - 1]}'`,
      `The word contains '${currentWord[Math.floor(currentWord.length / 2)]}'`,
      `Contains ${currentWord.match(/[aeiou]/gi)?.length || 0} vowels`,
      `${currentWord.split('').filter((char, i) => currentWord.indexOf(char) !== i).length > 0 ? 'Has repeated letters' : 'No repeated letters'}`,
    ];

    const availableHints = hintTypes.filter(hint => !hints.includes(hint));
    if (availableHints.length > 0) {
      const newHint = availableHints[Math.floor(Math.random() * availableHints.length)];
      setHints(prev => [...prev, newHint]);
      setHintCount(prev => prev - 1);
      playSound('hint');
    } else {
      showNotification('All available hints used!', 'warning');
    }
  };

  const getTutorialSteps = () => [
    {
      title: 'Welcome to Word Weaver!',
      content: 'Learn to play in just a few steps.'
    },
    {
      title: 'Choose Your Challenge',
      content: 'Select difficulty and category before starting.'
    },
    {
      title: 'Game Mechanics',
      content: 'Guess the word before time runs out. Use hints wisely!'
    },
    {
      title: 'Scoring System',
      content: 'Earn points based on difficulty and time remaining.'
    },
    {
      title: 'Achievements',
      content: 'Complete special challenges to unlock achievements!'
    }
  ];

  return (
    <Paper className={classes.root} style={{ 
      backgroundColor: darkMode ? '#333' : '#fff',
      color: darkMode ? '#fff' : '#000' 
    }}>
      <IconButton 
        className={classes.darkMode}
        onClick={() => {
          setDarkMode(!darkMode);
          localStorage.setItem('wordweaver_darkMode', !darkMode);
        }}
      >
        <Brightness4 />
      </IconButton>

      <IconButton
        onClick={() => setSoundEnabled(!soundEnabled)}
        style={{ position: 'absolute', top: '16px', right: '64px' }}
      >
        {soundEnabled ? <VolumeUp /> : <VolumeOff />}
      </IconButton>

      <IconButton
        onClick={() => setShowTutorial(true)}
        style={{ position: 'absolute', top: '16px', right: '112px' }}
      >
        <Help />
      </IconButton>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Word Weaver
          </Typography>
          
          <div className={classes.controls}>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              variant="outlined"
              disabled={gameActive}
            >
              {Object.keys(DIFFICULTY_LEVELS).map((level) => (
                <MenuItem key={level} value={level}>
                  {DIFFICULTY_LEVELS[level].name}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              variant="outlined"
              disabled={gameActive}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              color="primary"
              onClick={generateNewWord}
              disabled={gameActive}
            >
              New Game
            </Button>

            <Tooltip title={`${hintCount} hints remaining`}>
              <span>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={generateHint}
                  disabled={!gameActive || hintCount <= 0}
                >
                  Get Hint
                </Button>
              </span>
            </Tooltip>

            <div className={classes.timer}>
              <Timer />
              <Typography variant="h6" style={{ marginLeft: '8px' }}>
                {timeLeft}s
              </Typography>
            </div>
          </div>

          <LinearProgress 
            variant="determinate" 
            value={levelProgress} 
            className={classes.progressBar}
            color="secondary"
          />

          <div className={classes.gameArea}>
            {gameActive ? (
              <>
                <div className={classes.letterGrid}>
                  {currentWord.split('').map((letter, index) => (
                    <Paper
                      key={index}
                      className={`${classes.letterBox} ${guess[index] ? 
                        guess[index].toLowerCase() === letter.toLowerCase() ? 
                        classes.correct : classes.incorrect : ''}`}
                    >
                      {guess[index] || ''}
                    </Paper>
                  ))}
                </div>

                <TextField
                  value={guess}
                  onChange={(e) => setGuess(e.target.value.slice(0, currentWord.length))}
                  variant="outlined"
                  label="Your guess"
                  onKeyPress={(e) => e.key === 'Enter' && handleGuessSubmit()}
                  autoFocus
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGuessSubmit}
                  style={{ marginTop: '16px' }}
                >
                  Submit
                </Button>

                <div style={{ marginTop: '16px' }}>
                  {hints.map((hint, index) => (
                    <Chip
                      key={index}
                      label={hint}
                      style={{ margin: '4px' }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </div>
              </>
            ) : (
              <Typography variant="h5">
                Press 'New Game' to start!
              </Typography>
            )}
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={classes.score}>
            <Typography variant="h6">
              Score: {score}
              <Tooltip title="Current streak">
                <Badge badgeContent={streak} color="secondary" max={999}>
                  <Chip
                    icon={<EmojiEvents />}
                    label="Streak"
                    className={classes.streak}
                    style={{ backgroundColor: '#fff', color: '#000' }}
                  />
                </Badge>
              </Tooltip>
            </Typography>
          </Paper>

          <Paper style={{ marginTop: '16px', padding: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Achievements
            </Typography>
            {achievements.map((achievement) => (
              <Tooltip 
                key={achievement}
                title={ACHIEVEMENTS[achievement].description}
              >
                <Chip
                  icon={<Star />}
                  label={`${ACHIEVEMENTS[achievement].icon} ${ACHIEVEMENTS[achievement].name}`}
                  className={classes.achievement}
                  color="secondary"
                />
              </Tooltip>
            ))}
          </Paper>

          <Paper style={{ marginTop: '16px', padding: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Recent Games:
            </Typography>
            {gameHistory.slice(-5).reverse().map((game, index) => (
              <Tooltip 
                key={index}
                title={`Time: ${game.time}s | Hints: ${game.hintsUsed} | Points: ${game.points || 0}`}
              >
                <Chip
                  label={game.word}
                  className={classes[game.success ? 'correct' : 'incorrect']}
                  style={{ margin: '4px' }}
                />
              </Tooltip>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={showTutorial} onClose={() => setShowTutorial(false)}>
        <DialogTitle>How to Play</DialogTitle>
        <DialogContent>
          {getTutorialSteps().map((step, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <Typography variant="h6">{step.title}</Typography>
              <Typography>{step.content}</Typography>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTutorial(false)} color="primary">
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Game;