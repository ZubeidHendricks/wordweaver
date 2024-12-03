const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB, User } = require('./db');

module.exports = async (req, res) => {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
      return res.status(200).json({ message: 'ok' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectDB();

    const { username, password } = req.body;
    console.log('Received login request for:', username);

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User logged in successfully:', username);

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        score: user.score,
        level: user.level
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};