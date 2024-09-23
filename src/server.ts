import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to MongoDB");

    app.listen(config.port, () => {
      console.log(`Server is running on port : ${config.port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
