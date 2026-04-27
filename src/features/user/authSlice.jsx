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

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      if (!state.auth.token) {
        return rejectWithValue({ message: "No token found" });
      }
      const response = await axios.get(
        "http://localhost:5000/api/v1/user/current-user",
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Failed to fetch user",
        errors: data?.errors || [],
      });
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ username, phone }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.patch(
        "http://localhost:5000/api/v1/user/update-account",
        { username, phone },
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Profile update failed",
        errors: data?.errors || [],
      });
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ oldPassword, newPassword }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      const data = error?.response?.data;
      return rejectWithValue({
        message: data?.message || "Password update failed",
        errors: data?.errors || [],
      });
    }
  }
);

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
      })
      
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data; // ApiResponse returns user in payload.data
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        // If getting current user fails, don't necessarily show an error popup, just log them out or clear user.
        // If token expired, could handle refresh token here, but for now just clear token
        if (action.payload?.message !== "No token found") {
           state.user = null;
           state.token = null;
           localStorage.removeItem("token");
        }
      })
      
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if(state.user) {
           state.user.username = action.payload.data.username;
           state.user.phone = action.payload.data.phone;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "Profile update failed";
      })

      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "Password update failed";
      });
  },
});

export default authSlice.reducer;
