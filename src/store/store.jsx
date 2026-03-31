import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/user/authSlice.jsx"

export const store = configureStore({
    reducer : {
        auth : authReducer
    }
});