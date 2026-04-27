import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  clients: [],
  isLoading: false,
  isError: false,
  errorMessage: null,
};

export const fetchClients = createAsyncThunk(
  "client/fetchClients",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.get("http://localhost:5000/api/v1/clients", {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Failed to fetch clients",
      });
    }
  }
);

export const createClient = createAsyncThunk(
  "client/createClient",
  async (clientData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.post(
        "http://localhost:5000/api/v1/clients",
        clientData,
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
        message: data?.message || "Failed to create client",
      });
    }
  }
);

export const deleteClient = createAsyncThunk(
  "client/deleteClient",
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.delete(
        `http://localhost:5000/api/v1/clients/${id}`,
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        }
      );
      // return the id so we can remove it from state
      return { id }; 
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Failed to delete client",
      });
    }
  }
);

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearClientErrors: (state) => {
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchClients.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = action.payload.data;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })
      // Create Client
      .addCase(createClient.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.isLoading = false;
        // API returns created client in action.payload.data
        if (action.payload.data) {
          state.clients.push(action.payload.data);
        }
      })
      .addCase(createClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })
      // Delete Client
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = state.clients.filter(
          (client) => client._id !== action.payload.id
        );
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      });
  },
});

export const { clearClientErrors } = clientSlice.actions;
export default clientSlice.reducer;
