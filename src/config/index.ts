import dotenv from "dotenv";

dotenv.config();

export const config = {
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/testdb",
  port: process.env.PORT || 5000,
};
