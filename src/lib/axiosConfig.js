import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 
             (process.env.NODE_ENV === 'production' 
                ? "https://knots-backend-1.onrender.com"
                : "http://localhost:3000"),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

export default instance;