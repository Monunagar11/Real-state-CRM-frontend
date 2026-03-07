import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user : null,
    token : localStorage.getItem("token") || null,
    isLoading : false,
    isError : false
}
export const loginUser = createAsyncThunk('auth/loginUser', async({email,password})=>{
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
})

const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/logout');
        localStorage.removeItem("token");
        return response.data;
    } catch (error) {
        throw error;
    }
})


const authSlice = createSlice(
    {
        name: "auth",
        initialState,
        extraReducers : (builder) =>{

            builder
                .addCase(loginUser.pending, (state) => {
                    state.isLoading = true;
                    state.isError = false;
                })
                .addCase(loginUser.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                    localStorage.setItem("token", action.payload.token);
                })
                .addCase(loginUser.rejected, (state) => {
                    state.isLoading = false;
                    state.isError = true;
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
            
        }
    }
)