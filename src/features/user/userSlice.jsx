import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState : {
        user : null,
        isLoggin : false,
        isError : false,
    },
    
})

export default userSlice.reducer;