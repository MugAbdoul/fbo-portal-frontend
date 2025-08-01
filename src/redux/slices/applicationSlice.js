import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  applications: [],
  currentApplication: null,
  applicationComments: [],
  documentRequirements: [],
  stats: null,
  loading: false,
  error: null,
  uploadProgress: 0,
};

// Async thunks
// In your applicationSlice.js
export const createApplication = createAsyncThunk(
  'applications/create',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      // Extract file data from the formData
      const { files, ...applicationData } = data;
      
      // Step 1: Create the application with JSON data
      const response = await api.post('/application', applicationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const applicationId = response.data.application.id;
      
      // Step 2: Upload each document
      if (files && Object.keys(files).length > 0) {
        const uploadPromises = Object.keys(files).map(docType => {
          const formData = new FormData();
          formData.append('application_id', applicationId);
          formData.append('document_type', docType);
          formData.append('file', files[docType]);
          
          return api.post('/documents/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        });
        
        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to create application' });
    }
  }
);

export const getApplications = createAsyncThunk(
  'applications/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/application');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch applications' });
    }
  }
);

export const getApplicationById = createAsyncThunk(
  'applications/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/application/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch application' });
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ applicationId, status, comment }, { rejectWithValue }) => {
    try {
      const response = await api.put('/application/status', {
        application_id: applicationId,
        status,
        comment: comment || '', // Use 'comment' instead of 'comments'
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to update status' });
    }
  }
);

export const getApplicationComments = createAsyncThunk(
  'applications/getComments',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/application/${applicationId}/comments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch comments' });
    }
  }
);

export const addApplicationComment = createAsyncThunk(
  'applications/addComment',
  async ({ applicationId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/application/${applicationId}/comments`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to add comment' });
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
      return rejectWithValue(error.response?.data || { error: 'Failed to upload document' });
    }
  }
);

export const getDocumentRequirements = createAsyncThunk(
  'applications/getDocumentRequirements',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/application/${applicationId}/documents/requirements`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch document requirements' });
    }
  }
);

export const getApplicationStats = createAsyncThunk(
  'applications/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/application/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch stats' });
    }
  }
);

export const getWorkflowInfo = createAsyncThunk(
  'applications/getWorkflow',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/application/workflow');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch workflow info' });
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
      state.applicationComments = [];
    },
    clearApplicationComments: (state) => {
      state.applicationComments = [];
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
        state.error = null;
      })
      .addCase(getApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications || [];
      })
      .addCase(getApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch applications';
      })
      
      // Get Application by ID
      .addCase(getApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload.application;
      })
      .addCase(getApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch application';
      })
      
      // Update Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.error = null;
      })
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
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.error = action.payload?.error || 'Failed to update status';
      })
      
      // Get Comments
      .addCase(getApplicationComments.pending, (state) => {
        state.error = null;
      })
      .addCase(getApplicationComments.fulfilled, (state, action) => {
        state.applicationComments = action.payload.comments || [];
      })
      .addCase(getApplicationComments.rejected, (state, action) => {
        state.error = action.payload?.error || 'Failed to fetch comments';
      })
      
      // Add Comment
      .addCase(addApplicationComment.pending, (state) => {
        state.error = null;
      })
      .addCase(addApplicationComment.fulfilled, (state, action) => {
        if (action.payload.comment) {
          state.applicationComments.unshift(action.payload.comment);
        }
      })
      .addCase(addApplicationComment.rejected, (state, action) => {
        state.error = action.payload?.error || 'Failed to add comment';
      })
      
      // Upload Document
      .addCase(uploadDocument.pending, (state) => {
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploadProgress = 100;
        // Update document requirements
        if (state.documentRequirements.length > 0 && action.payload.document) {
          const docType = action.payload.document.document_type;
          const reqIndex = state.documentRequirements.findIndex(req => req.document_type === docType);
          if (reqIndex !== -1) {
            state.documentRequirements[reqIndex].uploaded = true;
            state.documentRequirements[reqIndex].document_id = action.payload.document.id;
            state.documentRequirements[reqIndex].is_valid = action.payload.document.is_valid;
          }
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploadProgress = 0;
        state.error = action.payload?.error || 'Failed to upload document';
      })
      
      // Document Requirements
      .addCase(getDocumentRequirements.pending, (state) => {
        state.error = null;
      })
      .addCase(getDocumentRequirements.fulfilled, (state, action) => {
        state.documentRequirements = action.payload.requirements || [];
      })
      .addCase(getDocumentRequirements.rejected, (state, action) => {
        state.error = action.payload?.error || 'Failed to fetch document requirements';
      })
      
      // Stats
      .addCase(getApplicationStats.pending, (state) => {
        state.error = null;
      })
      .addCase(getApplicationStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      })
      .addCase(getApplicationStats.rejected, (state, action) => {
        state.error = action.payload?.error || 'Failed to fetch stats';
      })
      
      // Workflow Info
      .addCase(getWorkflowInfo.fulfilled, (state, action) => {
        state.workflowInfo = action.payload.workflow;
      });
  },
});

export const { 
  clearError, 
  clearCurrentApplication, 
  clearApplicationComments,
  updateUploadProgress 
} = applicationSlice.actions;

export default applicationSlice.reducer;