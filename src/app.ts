import express, { Application, Request, Response, NextFunction } from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoute";
import categoryRoutes from "./routes/categoryRoute";

import errorMiddleware from "./middleware/errorMiddleware";
import cors from "cors";
import logger from "./utils/logger";

const app: Application = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`); // Log HTTP method and URL
  next();
});

app.use(cors());

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

app.use(errorMiddleware);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack }); // Log error details
  res.status(500).json({ message: "Internal server error" });
});

export default app;
