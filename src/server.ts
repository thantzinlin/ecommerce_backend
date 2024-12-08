import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";
import http from "http";
import { Server } from "socket.io";
import { setupSocket } from "./services/socket";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:4200",
      "https://orange-dune-065c3b710.4.azurestaticapps.net",
      "https://wonderful-ground-034220710.4.azurestaticapps.net",
    ],
    methods: ["GET", "POST"],
    credentials: false,
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
