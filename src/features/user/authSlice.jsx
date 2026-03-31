import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  isError: false,
  errorMessage: null, // top-level message from ApiError
  errors: [], // field-level errors array from ApiError
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        { email, password }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Login failed",
        errors: data?.errors || [],
        statusCode: data?.statusCode || error?.response?.status || 500,
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password, phone }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/register",
        { username, email, password, phone }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Registration failed",
        errors: data?.errors || [],
        statusCode: data?.statusCode || error?.response?.status || 500,
      });
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/v1/user/logout");
    localStorage.removeItem("token");
    return response.data;
  } catch (error) {
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
        state.errors = [];
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "Login failed";
        state.errors = action.payload?.errors || [];
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
        state.errors = [];
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = null;
        state.errors = [];
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "Registration failed";
        state.errors = action.payload?.errors || [];
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      });
  },
});

export default authSlice.reducer;
