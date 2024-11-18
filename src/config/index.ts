import dotenv from "dotenv";

dotenv.config();

export const config = {
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce",
  port: process.env.PORT || 5000,
  redisUri: process.env.REDIS_URI || "redis://localhost:6379",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDER_EMAIL: process.env.SENDER_EMAIL,
  WEBSITE_URL: process.env.WEBSITE_URL,
};
