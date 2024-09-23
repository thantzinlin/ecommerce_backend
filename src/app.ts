import express, { Application } from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoute";
import categoryRoutes from "./routes/categoryRoute";

import errorMiddleware from "./middleware/errorMiddleware";
import cors from "cors";

const app: Application = express();
app.use(cors());

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);

app.use(errorMiddleware);

export default app;
