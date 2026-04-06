import http from 'http';
import app from './src/app.js';
import { db } from './src/config/db.js';
import { initializeSocket } from './src/config/socket.js';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

function keepAlive() {
  const url = process.env.RENDER_EXTERNAL_URL
    || process.env.BACKEND_URL
    || `https://skill-developer-backend.onrender.com`;

  setInterval(() => {
    https.get(`${url}/api/health`, (res) => {
      console.log(`Keep-alive: ${res.statusCode}`);
    }).on('error', (e) => {
      console.log('Keep-alive error:', e.message);
    });
  }, 14 * 60 * 1000); // every 14 minutes
}

/**
 * Skill Developer Backend Entry Point
 * ----------------------------
 * This module creates the HTTP server and initializes the Socket.io
 * engine for real-time messaging and notifications.
 */

const port = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize WebSocket Gateway
const io = initializeSocket(server);
app.set('io', io);

// Initial Database Setup
db.setupDatabase();

server.listen(port, () => {
  console.log('---------------------------------------------------------');
  console.log(`🚀 Skill Developer Backend Authority online at PORT: ${port}`);
  console.log(`📡 WebSocket Gateway Pulse: Active`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('---------------------------------------------------------');
  
  if (process.env.NODE_ENV === 'production') {
    keepAlive();
  }
});