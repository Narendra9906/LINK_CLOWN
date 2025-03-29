import { createSlice } from "@reduxjs/toolkit";

export const isLoggedinSlice = createSlice({
    initialState: 0,
    name: "isLoggedin",
    reducers: {
        toggle: (state) => !state,
    },
})

export const {toggle} = isLoggedinSlice.actions;
export default isLoggedinSlice.reducer;