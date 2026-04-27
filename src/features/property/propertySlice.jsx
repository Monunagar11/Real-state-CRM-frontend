import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  properties: [],
  currentProperty: null,
  isLoading: false,
  isError: false,
  errorMessage: null,
  errors: [],
};

export const createProperty = createAsyncThunk(
  "property/createProperty",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.post(
        "http://localhost:5000/api/v1/properties",
        formData,
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Failed to create property",
        errors: data?.errors || [],
      });
    }
  }
);

export const fetchProperties = createAsyncThunk(
  "property/fetchProperties",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.get("http://localhost:5000/api/v1/properties", {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Failed to fetch properties",
      });
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  "property/fetchPropertyById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.get(`http://localhost:5000/api/v1/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Failed to fetch property details",
      });
    }
  }
);

export const deleteProperty = createAsyncThunk(
  "property/deleteProperty",
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      await axios.delete(`http://localhost:5000/api/v1/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return { id };
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Failed to delete property",
      });
    }
  }
);

export const updatePropertyStatus = createAsyncThunk(
  "property/updatePropertyStatus",
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.patch(
        `http://localhost:5000/api/v1/properties/${id}/status`,
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
        message: data?.message || "Failed to update property status",
      });
    }
  }
);

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    clearPropertyErrors: (state) => {
      state.isError = false;
      state.errorMessage = null;
      state.errors = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
        state.errors = [];
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties.push(action.payload.data);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "Failed to create property";
        state.errors = action.payload?.errors || [];
      })
      // fetchProperties
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload.data;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })
      // fetchPropertyById
      .addCase(fetchPropertyById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.currentProperty = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProperty = action.payload.data;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })
      // deleteProperty
      .addCase(deleteProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = state.properties.filter(p => p._id !== action.payload.id);
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })
      // updatePropertyStatus
      .addCase(updatePropertyStatus.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.properties.findIndex(p => p._id === updated._id);
        if (index !== -1) {
          state.properties[index] = updated;
        }
        if (state.currentProperty && state.currentProperty._id === updated._id) {
          state.currentProperty = updated;
        }
      });
  },
});

export const { clearPropertyErrors } = propertySlice.actions;
export default propertySlice.reducer;
