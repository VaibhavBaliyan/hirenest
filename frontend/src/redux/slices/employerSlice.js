import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// Fetch employer stats
export const fetchEmployerStats = createAsyncThunk(
  "employer/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/jobs/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

// Fetch employer jobs
export const fetchEmployerJobs = createAsyncThunk(
  "employer/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/jobs/my-jobs");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

const initialState = {
  stats: null,
  jobs: [],
  loading: false,
  error: null,
};

const employerSlice = createSlice({
  name: "employer",
  initialState,
  reducers: {
    clearEmployerData: (state) => {
      state.stats = null;
      state.jobs = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchEmployerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchEmployerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Jobs
      .addCase(fetchEmployerJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchEmployerJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmployerData } = employerSlice.actions;
export default employerSlice.reducer;
