import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Socket.IO connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket.IO disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error(
    "Socket.IO connection error:",
    error.message
  );
});

export default socket;