import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/user/authSlice.jsx"
import propertyReducer from "../features/property/propertySlice.jsx"
import clientReducer from "../features/client/clientSlice.jsx"
import leadReducer from "../features/lead/leadSlice.jsx"

export const store = configureStore({
    reducer : {
        auth : authReducer,
        property : propertyReducer,
        client : clientReducer,
        lead : leadReducer
    }
});