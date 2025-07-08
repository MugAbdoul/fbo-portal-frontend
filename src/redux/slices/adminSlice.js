import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  users: [],
  currentUser: null,
  dashboardStats: null,
  reports: [],
  loading: false,
  error: null,
};

// Async thunks
export const getUsers = createAsyncThunk(
  'admin/getUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const generateReport = createAsyncThunk(
  'admin/generateReport',
  async (reportParams, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/reports/generate', reportParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getApplicationStats = createAsyncThunk(
  'admin/getApplicationStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/applications/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch users';
      })
      // Create User
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload.user);
      })
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.user.id);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      // Dashboard Stats
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload.stats;
      })
      // Generate Report
      .addCase(generateReport.fulfilled, (state, action) => {
        state.reports.push(action.payload.report);
      })

      // Get Application Stats
    .addCase(getApplicationStats.pending, (state) => {
    state.loading = true;
    })
    .addCase(getApplicationStats.fulfilled, (state, action) => {
    state.loading = false;
    state.reports = action.payload.stats; // or .data depending on your API response
    })
    .addCase(getApplicationStats.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.error || 'Failed to fetch application stats';
    })

  },
});

export const { clearError, clearCurrentUser } = adminSlice.actions;
export default adminSlice.reducer;