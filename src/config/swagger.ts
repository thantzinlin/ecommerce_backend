import express from "express";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";

// Function to set up Swagger UI with JSON file
export const setupSwagger = (app: express.Application) => {
  // Read the Swagger JSON file
  const swaggerFilePath = path.join(__dirname, "../swagger/swagger.json");
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf8"));

  // Set up the Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
