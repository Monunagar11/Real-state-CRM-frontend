import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  properties: [],
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
      });
  },
});

export const { clearPropertyErrors } = propertySlice.actions;
export default propertySlice.reducer;
