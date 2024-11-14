import dotenv from "dotenv";

dotenv.config();

export const config = {
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce",
  port: process.env.PORT || 5000,
  redisUri: process.env.REDIS_URI || "redis://localhost:6379",
};
