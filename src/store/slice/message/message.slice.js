import { createSlice } from "@reduxjs/toolkit";
import { getMessage } from "./message.thunk";

const initialState = {
    messages: [],
    loading: false,
}

export const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        addMessage: (state ,action) => {
            state.messages.push(action.payload)
        },
        
    },
    extraReducers: (builder) => {

        //get message
        builder.addCase(getMessage.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(getMessage.fulfilled, (state, action) => {
            state.messages = action.payload?.chat?.messages || []
            state.loading = false
        })
        builder.addCase(getMessage.rejected, (state, action) => {
            state.loading = false
        })
    }
})


export const {addMessage } = messageSlice.actions;
export default messageSlice.reducer;