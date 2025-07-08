import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  applications: [],
  currentApplication: null,
  documentRequirements: [],
  stats: null,
  loading: false,
  error: null,
  uploadProgress: 0,
};

// Async thunks
export const createApplication = createAsyncThunk(
  'applications/create',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/applications', applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getApplications = createAsyncThunk(
  'applications/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/applications');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getApplicationById = createAsyncThunk(
  'applications/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ applicationId, status, comments }, { rejectWithValue }) => {
    try {
      const response = await api.put('/applications/status', {
        application_id: applicationId,
        status,
        comments,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'applications/uploadDocument',
  async ({ applicationId, documentType, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('application_id', applicationId);
      formData.append('document_type', documentType);
      formData.append('file', file);

      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDocumentRequirements = createAsyncThunk(
  'applications/getDocumentRequirements',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/applications/${applicationId}/documents/requirements`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getApplicationStats = createAsyncThunk(
  'applications/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/applications/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
    updateUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload.application);
        state.currentApplication = action.payload.application;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create application';
      })
      // Get Applications
      .addCase(getApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
      })
      .addCase(getApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch applications';
      })
      // Get Application by ID
      .addCase(getApplicationById.fulfilled, (state, action) => {
        state.currentApplication = action.payload.application;
      })
      // Update Status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const updatedApp = action.payload.application;
        const index = state.applications.findIndex(app => app.id === updatedApp.id);
        if (index !== -1) {
          state.applications[index] = updatedApp;
        }
        if (state.currentApplication?.id === updatedApp.id) {
          state.currentApplication = updatedApp;
        }
      })
      // Upload Document
      .addCase(uploadDocument.pending, (state) => {
        state.uploadProgress = 0;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploadProgress = 100;
        // Update document requirements
        if (state.documentRequirements.length > 0) {
          const docType = action.payload.document.document_type;
          const reqIndex = state.documentRequirements.findIndex(req => req.document_type === docType);
          if (reqIndex !== -1) {
            state.documentRequirements[reqIndex].uploaded = true;
            state.documentRequirements[reqIndex].document_id = action.payload.document.id;
          }
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploadProgress = 0;
        state.error = action.payload?.error || 'Failed to upload document';
      })
      // Document Requirements
      .addCase(getDocumentRequirements.fulfilled, (state, action) => {
        state.documentRequirements = action.payload.requirements;
      })
      // Stats
      .addCase(getApplicationStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      });
  },
});

export const { clearError, clearCurrentApplication, updateUploadProgress } = applicationSlice.actions;
export default applicationSlice.reducer;