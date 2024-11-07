import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";
import http from "http";
import { Server } from "socket.io";
import { setupSocket } from "./services/socket";

const server = http.createServer(app);

// Declare `io` at the top level and export it
//export const io = new Server(server);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend origin
    methods: ["GET", "POST"],
    credentials: false, // Allow credentials if needed
  },
});
const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to MongoDB");

    // Initialize Socket.IO with the server
    setupSocket(io);

    server.listen(config.port, () => {
      console.log(`Server is running on port: ${config.port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
