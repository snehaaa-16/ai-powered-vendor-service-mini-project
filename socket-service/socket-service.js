import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import socketConnection from './config/socket.js';

dotenv.config();
const app = express();
const server = createServer(app);

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Validate required environment variables
const MONGODB_URI = requireEnv('MONGODB_URI');
const SOCKET_PORT = requireEnv('SOCKET_PORT');
const FRONTEND_URL = requireEnv('FRONTEND_URL');

app.use(cors());
app.use(express.json());

// Initialize database connection
connectDB();

// Initialize socket connection
const io = socketConnection.initialize(server);

app.get('/', (req, res) => {
  res.send('Socket Service');
});

app.get('/health', (req, res) => {
  const socketStatus = socketConnection.getStatus();
  res.json({ 
    status: 'OK', 
    message: 'Socket.io Service is running',
    timestamp: new Date().toISOString(),
    socket: socketStatus,
    services: {
      mongodb: 'connected',
      socket: socketStatus.isInitialized ? 'connected' : 'disconnected'
    }
  });
});

server.listen(SOCKET_PORT, () => {
  console.log(`🔌 Socket.io Service running on port ${SOCKET_PORT}`);
  console.log(`📡 Socket endpoint: http://localhost:${SOCKET_PORT}`);
  console.log(`📊 Health check available at http://localhost:${SOCKET_PORT}/health`);
});

export default { app, server, io };   