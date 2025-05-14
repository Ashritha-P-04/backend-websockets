const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cartRoutes = require('./routes/cartRoutes.js');

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000' }, // allow all for dev
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/cart', cartRoutes);

// Shared cart (in-memory for demo, can be stored in DB)
let sharedCart = [];

// WebSocket logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current cart to new user
  socket.emit('cart-updated', sharedCart);

  // Handle new cart update from a client
  socket.on('update-cart', (newCart) => {
    sharedCart = newCart;
    io.emit('cart-updated', sharedCart); // broadcast to all
  });

  // Confirm payment from a client
  socket.on('confirm-payment', (billingDetails) => {
    console.log('Payment confirmed:', billingDetails);

    sharedCart = []; // Clear the cart after payment
    io.emit('cart-updated', []); // Update all clients
    io.emit('payment-confirmed', billingDetails); // Optional: show message
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// MongoDB connection and start server
mongoose.connect('mongodb://127.0.0.1:27017/pizza-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start server here
}).catch(err => {
  console.error('MongoDB connection failed', err);
});
