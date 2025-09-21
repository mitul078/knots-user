// src/lib/socket.js
import { io } from "socket.io-client";

const socket = io("https://knots-backend-1.onrender.com", {
    withCredentials: true,
    transports: ["websocket"]
});

// const socket = io ("http://localhost:3000" , {
//     withCredentials: true,
//     transports:["websocket"]
// })

export default socket;
