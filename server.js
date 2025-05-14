// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cart', cartRoutes);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/pizza-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection failed', err);
});
