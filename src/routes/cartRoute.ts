import { Router } from "express";
import * as cartController from "../controllers/cartController";
import isAuth from "../middleware/authMiddleware";

const router = Router();

router.post("/", isAuth, cartController.addToCart);
router.get("/", isAuth, cartController.getCartItem);
router.get("/count", isAuth, cartController.getCartItemCount);

export default router;
