// Basic authentication route for login and registration
export default async function handler(req, res) {
  // Dummy in-memory user storage
  const users = new Map();

  // Basic endpoint for authentication
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { action } = req.query;
  const { username, password } = req.body;

  // Basic input validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    switch(action) {
      case 'register':
        // Check if user already exists
        if (users.has(username)) {
          return res.status(400).json({ message: 'Username already exists' });
        }

        // Store user (basic storage, replace with proper database in production)
        users.set(username, { username, password });

        return res.status(201).json({
          message: 'User registered successfully',
          user: { username },
          token: 'dummy_token_' + username
        });

      case 'login':
        const user = Array.from(users.values()).find(
          u => u.username === username && u.password === password
        );

        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        return res.status(200).json({
          message: 'Login successful',
          user: { username },
          token: 'dummy_token_' + username
        });

      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}