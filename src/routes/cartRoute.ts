import { Router } from "express";
import * as cartController from "../controllers/cartController";
import isAuth from "../middleware/authMiddleware";

const router = Router();

router.post("/", cartController.addToCart);
router.get("/", cartController.getCartItem);
router.get("/count", cartController.getCartItemCount);

export default router;
