import http from 'http';
import { Server } from 'socket.io';
import { initializeSocketHandlers } from './socket-handler'; // Import your socket event handlers
import RabbitMQService from '../message-queue/rabbitmq'; // Import the RabbitMQ service

require('dotenv').config(); // Load environment variables from .env

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
// Initialize socket event handlers
initializeSocketHandlers(io);

const PORT = process.env.SOCKET_PORT || 3001;
// Start the Express server
httpServer.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
