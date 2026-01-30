import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../features/user/userSlice.jsx"

export const store = configureStore({
    reducer : {
        user : userReducer
    }
});