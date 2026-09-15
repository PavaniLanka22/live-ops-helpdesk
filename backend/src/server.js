import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/db.js";
import { registerSocketHandlers } from "./sockets/socketHandler.js";

const PORT = process.env.PORT || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

// Connect to MongoDB
await connectDB();

// Create HTTP server
const httpServer = http.createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },

  // Use WebSocket transport
  transports: ["websocket"],
});

// Register all Socket.IO events
registerSocketHandlers(io);

// Start server
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed frontend origin: ${CLIENT_URL}`);
});