// user.thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../lib/axiosConfig";

export const loginUserThunk = createAsyncThunk(
    "users/loginUser",
    async ({ identifier, password }, { rejectWithValue }) => {
        try {
            const res = await axios.post("/api/auth/login", { identifier, password });
            return res.data; // token or minimal user info
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

export const registerUserThunk = createAsyncThunk(
    "users/registerUser",
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const res = await axios.post("/api/auth/register", {
                username,
                email,
                password,
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

// 👇 New thunk to fetch user profile
export const getMeThunk = createAsyncThunk(
    "users/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("/api/auth/me");
            return res.data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch user"
            );
        }
    }
);
