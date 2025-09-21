import axios from "axios";
const instance = axios.create({
    // baseURL: "http://localhost:3000",
    baseURL: "https://knots-backend-1.onrender.com",
    withCredentials: true
})

export default instance;