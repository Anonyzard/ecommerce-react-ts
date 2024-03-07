import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: "",
}

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, newToken) => {
            state.token = newToken.payload
        }
    }
})

export const { setToken } = tokenSlice.actions

export default tokenSlice.reducer