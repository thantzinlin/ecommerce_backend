import express, { Application, Request, Response, NextFunction } from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoute";
import categoryRoutes from "./routes/categoryRoute";
import productRoutes from "./routes/productRoute";

import errorMiddleware from "./middleware/errorMiddleware";
import cors from "cors";
import logger from "./utils/logger";
import orderRoute from "./routes/orderRoute";
import reviewRoute from "./routes/reviewRoute";
import notiRoute from "./routes/notiRoute";
import cartRoute from "./routes/cartRoute";
import { setupSwagger } from "./config/swagger";

const app: Application = express();
app.use(express.json({ limit: "50mb" }));

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info({
    body: req.body,
    method: req.method,
    url: req.url,
  });

  next();
});

app.use(cors());
//setupSwagger(app);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/notifications", notiRoute);
app.use("/api/cart", cartRoute);

app.use(errorMiddleware);

export default app;
