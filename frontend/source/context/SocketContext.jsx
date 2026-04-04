import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only connect if user is authenticated and we know their user id mapping
    if (isAuthenticated && user?.id) {
      const backendUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
      
      const newSocket = io(backendUrl, {
        withCredentials: true, // sends cookies mapped
      });

      newSocket.on('connect', () => {
        // Tie their connection instance ID to their Database User UUID
        newSocket.emit('register', user.id);
      });

      // Global Notification Listener
      newSocket.on('receive_notification', (data) => {
         // Display a highly visible toast if we get a global real-time event
         toast(data.message, {
           icon: '🔔',
           style: {
             borderRadius: '10px',
             background: '#333',
             color: '#fff',
           },
         });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

