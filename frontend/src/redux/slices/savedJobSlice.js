import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// Save a job
export const saveJob = createAsyncThunk(
  "savedJobs/saveJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/saved-jobs/${jobId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save job"
      );
    }
  }
);

// Get saved jobs
export const fetchSavedJobs = createAsyncThunk(
  "savedJobs/fetchSavedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/saved-jobs");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch saved jobs"
      );
    }
  }
);

// Unsave a job
export const unsaveJob = createAsyncThunk(
  "savedJobs/unsaveJob",
  async (jobId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/saved-jobs/${jobId}`);
      return jobId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unsave job"
      );
    }
  }
);

const initialState = {
  savedJobs: [],
  savedJobIds: [], // Array of job IDs for quick lookup
  loading: false,
  error: null,
};

const savedJobSlice = createSlice({
  name: "savedJobs",
  initialState,
  reducers: {
    clearSavedJobs: (state) => {
      state.savedJobs = [];
      state.savedJobIds = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save job
      .addCase(saveJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs.unshift(action.payload);
        state.savedJobIds.push(action.payload.jobId._id);
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch saved jobs
      .addCase(fetchSavedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs = action.payload;
        state.savedJobIds = action.payload.map((saved) => saved.jobId._id);
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Unsave job
      .addCase(unsaveJob.fulfilled, (state, action) => {
        state.savedJobs = state.savedJobs.filter(
          (saved) => saved.jobId._id !== action.payload
        );
        state.savedJobIds = state.savedJobIds.filter(
          (id) => id !== action.payload
        );
      });
  },
});

export const { clearSavedJobs } = savedJobSlice.actions;
export default savedJobSlice.reducer;
