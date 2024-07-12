const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes'); 


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/game', gameRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/purchase', purchaseRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));