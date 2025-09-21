import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../lib/axiosConfig";

export const getMessage = createAsyncThunk("message/get",
    async ({ receiverId }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/api/room/get-messages/${receiverId}`)
            return res.data
        } catch (error) {
            console.log(error)
            return rejectWithValue(error?.response?.data?.message)
        }
    })