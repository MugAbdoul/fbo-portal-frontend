import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import applicationSlice from './slices/applicationSlice';
import notificationSlice from './slices/notificationSlice';
import adminSlice from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    applications: applicationSlice,
    notifications: notificationSlice,
    admin: adminSlice,
  },
});