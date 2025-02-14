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
import cityRoute from "./routes/cityRoute";
import townshipRoute from "./routes/townshipRoute";
import { setupSwagger } from "./config/swagger";

const app: Application = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  logger.info({
    message: "Incoming request",
    body: req.body,
    method: req.method,
    url: req.url,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      message: "Response sent",
      statusCode: res.statusCode,
      method: req.method,
      url: req.url,
      duration: `${duration}ms`,
      responseBody: res.statusCode >= 400 ? "Error response" : "Success",
    });
  });

  next();
});
// const corsOptions = {
//   origin: "https://wonderful-ground-034220710.4.azurestaticapps.net",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));
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
app.use("/api/cities", cityRoute);
app.use("/api/townships", townshipRoute);

app.use(errorMiddleware);

export default app;
