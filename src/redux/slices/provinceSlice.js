// redux/slices/provinceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunk to fetch provinces with districts
export const fetchProvinces = createAsyncThunk(
  'provinces/fetchProvinces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/provinces');
      return response.data.provinces;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch provinces' });
    }
  }
);

const provinceSlice = createSlice({
  name: 'provinces',
  initialState: {
    provinces: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = provinceSlice.actions;
export default provinceSlice.reducer;