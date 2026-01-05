import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// Register company
export const registerCompany = createAsyncThunk(
  "company/register",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/companies", companyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to register company"
      );
    }
  }
);

// Fetch my company
export const fetchMyCompany = createAsyncThunk(
  "company/fetchMyCompany",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/companies/mine");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company profile"
      );
    }
  }
);

// Update company
export const updateCompany = createAsyncThunk(
  "company/update",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/companies/mine", companyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update company"
      );
    }
  }
);

const initialState = {
  company: null,
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Company
      .addCase(fetchMyCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(fetchMyCompany.rejected, (state, action) => {
        state.loading = false;
        // Don't set error if it's just 404 (not found) as it's expected for new users
        if (action.payload !== "No company profile found") {
          state.error = action.payload;
        }
        state.company = null;
      })
      // Update
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCompanyError } = companySlice.actions;
export default companySlice.reducer;
