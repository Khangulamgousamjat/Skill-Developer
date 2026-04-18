import { Server } from 'socket.io';

let io;
const userSockets = new Map(); // Maps user ID to socket ID

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'https://skill-developer.vercel.app',
        'https://smart-skill-live-learning-module.vercel.app'
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // When a user authenticates, they'll emit 'register' with their ID
    socket.on('register', (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`User ${userId} registered to socket ${socket.id}`);
      // Notify others that a user came online (optional)
      io.emit('user_online', { userId });
    });

    // Handle generic private messages
    socket.on('send_message', (data) => {
      const { receiverId, message, senderId, senderName } = data;
      const targetSocketId = userSockets.get(receiverId);

      // If the target is online, push it directly
      if (targetSocketId) {
        io.to(targetSocketId).emit('receive_message', {
          senderId,
          senderName,
          message,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // Remove from tracking map
      for (const [userId, sockId] of userSockets.entries()) {
        if (sockId === socket.id) {
          userSockets.delete(userId);
          io.emit('user_offline', { userId });
          break;
        }
      }
    });
  });

  return io;
};

// Expose a way for REST Controllers to broadcast out to specific users
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

// Helper for sending a notification to a specific user
export const notifyUser = (userId, eventName, payload) => {
    const targetSocket = userSockets.get(userId);
    if (targetSocket && io) {
        io.to(targetSocket).emit(eventName, payload);
    }
};
