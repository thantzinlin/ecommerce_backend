import { Router } from "express";
import * as cartController from "../controllers/cartController";
import isAuth from "../middleware/authMiddleware";

const router = Router();

router.post("/", isAuth, cartController.create);

export default router;
