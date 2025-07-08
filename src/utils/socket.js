import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import {store} from '../redux/store'; // Import your Redux store
import {  getNotifications } from '../redux/slices/notificationSlice';
import { getApplications } from '../redux/slices/applicationSlice';

let socket = null;

export const initializeSocket = (user) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
    auth: {
      token: localStorage.getItem('token'),
    },
  });

  socket.on('connect', () => {
    console.log('Connected to server');
    
    // Join user-specific room
    if (user.role) {
      // Admin user
      socket.emit('join_room', `admin_${user.id}`);
      if (user.role === 'FBO_OFFICER') {
        socket.emit('join_room', 'fbo_officers');
      }
    } else {
      // Applicant user
      socket.emit('join_room', `applicant_${user.id}`);

    }

    // Refresh notifications on connect/reconnect
    store.dispatch(getNotifications());
    store.dispatch(getApplications());
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  // Application-related events
  socket.on('new_application', (data) => {
    toast.success(`New application from ${data.applicant_name}`);
    store.dispatch(getApplications());
  });

  socket.on('status_update', (data) => {
    toast.info(`Application status updated: ${data.new_status}`);
  });

  socket.on('new_notification', (data) => {
    toast.info(data.title);
    store.dispatch(getNotifications());
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const refreshNotifications = () => {
  store.dispatch(getNotifications());
};