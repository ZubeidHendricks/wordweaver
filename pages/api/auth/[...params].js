import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  score: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
});

// Get User model (create if doesn't exist)
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Global promise for connection
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, opts);
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { params } = req.query;
  const action = params[0]; // 'login' or 'register'

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    const { username, password } = req.body;
    console.log(`Received ${action} request for user:`, username);

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (action === 'register') {
      // Check if user exists
      const existingUser = await User.findOne({ username }).maxTime(5000);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = new User({ username, password: hashedPassword });
      await user.save({ maxTimeMS: 5000 });
      console.log('Created new user:', username);

      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        token,
        user: { id: user._id, username: user.username }
      });
    }

    if (action === 'login') {
      // Find user
      const user = await User.findOne({ username }).maxTime(5000);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('User logged in:', username);

      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        token,
        user: { id: user._id, username: user.username }
      });
    }

    return res.status(404).json({ message: 'Route not found' });

  } catch (error) {
    console.error(`Error in ${action}:`, error);
    return res.status(500).json({
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}