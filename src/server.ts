import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";
import http from "http";
import { Server } from "socket.io";
import { setupSocket } from "./services/socket";
// import { testRedisConnection } from "./services/redisService";

const server = http.createServer(app);

// testRedisConnection();
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:4200"],
    methods: ["GET", "POST"],
    credentials: false, // Allow credentials if needed
  },
});
const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to MongoDB");

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
