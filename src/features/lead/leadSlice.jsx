import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  leads: [],
  isLoading: false,
  isError: false,
  errorMessage: null,
};

export const fetchLeads = createAsyncThunk(
  "lead/fetchLeads",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.get("http://localhost:5000/api/v1/leads", {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Failed to fetch leads",
      });
    }
  }
);

export const createLead = createAsyncThunk(
  "lead/createLead",
  async (leadData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.post(
        "http://localhost:5000/api/v1/leads",
        leadData,
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Failed to create lead",
      });
    }
  }
);

export const deleteLead = createAsyncThunk(
  "lead/deleteLead",
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      await axios.delete(`http://localhost:5000/api/v1/leads/${id}`, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return { id };
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Failed to delete lead",
      });
    }
  }
);

export const updateLeadStatus = createAsyncThunk(
  "lead/updateLeadStatus",
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.patch(
        `http://localhost:5000/api/v1/leads/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Failed to update lead status",
      });
    }
  }
);

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    clearLeadErrors: (state) => {
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leads
      .addCase(fetchLeads.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = action.payload.data;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })
      // Create Lead
      .addCase(createLead.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.leads.push(action.payload.data);
        }
      })
      .addCase(createLead.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })
      // Delete Lead
      .addCase(deleteLead.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = state.leads.filter((lead) => lead._id !== action.payload.id);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })
      // Update Status
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        const updatedLead = action.payload.data;
        const index = state.leads.findIndex((l) => l._id === updatedLead._id);
        if (index !== -1) {
          state.leads[index] = updatedLead;
        }
      });
  },
});

export const { clearLeadErrors } = leadSlice.actions;
export default leadSlice.reducer;
