import { createSlice } from "@reduxjs/toolkit";
import { loginUserThunk, registerUserThunk, getMeThunk } from "./user.thunk";

const initialState = {
    user: null,
    loading: false,
    error: null,
    selectedUser: null
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.error = null;
        },

        //while login , save the user
        setUser: (state, action) => {
            state.user = action.payload;
        },

        //bug while change the username and go to the profile route
        setNewUsername: (state, action) => {
            if (state.user) {
                state.user.username = action.payload
            }
        },

        //at chat section to see a chat at right side
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        }
    },

    extraReducers: (builder) => {
        // --- Login ---
        builder.addCase(loginUserThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            // after login, we don’t trust payload fully — call /me
            console.log("login success, now fetch /me");
        });
        builder.addCase(loginUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // --- Register ---
        builder.addCase(registerUserThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            console.log("register success, now fetch /me");
        });
        builder.addCase(registerUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // --- GetMe ---
        builder.addCase(getMeThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getMeThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload; // store fresh user object
        });
        builder.addCase(getMeThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { logout, setUser, setSelectedUser, setNewUsername } = userSlice.actions;
export default userSlice.reducer;
