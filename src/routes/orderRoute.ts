import { Router } from "express";
import * as orderController from "../controllers/orderController";
import isAuth from "../middleware/authMiddleware";

const router = Router();

router.get("/", isAuth, orderController.getALL);
router.get("/:id", isAuth, orderController.getById);
router.post("/", isAuth, orderController.create);
router.put("/:id", isAuth, orderController.findByIdAndUpdate);
router.delete("/:id", isAuth, orderController.findByIdAndDelete);

export default router;
