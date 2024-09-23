import express, { Application } from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoute";
import errorMiddleware from "./middleware/errorMiddleware";
import cors from "cors";

const app: Application = express();
app.use(cors());

app.use(express.json());
app.use("/api/users", userRoutes); // Define API route for users
app.use("/api/auth", authRoutes);
app.use(errorMiddleware);

export default app;
