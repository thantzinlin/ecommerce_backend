import { Router } from "express";
import * as productController from "../controllers/productController";
import isAuth from "../middleware/authMiddleware";
import multerConfig from "../middleware/multerConfig";

const router = Router();

router.get("/", isAuth, productController.getALL);
router.get("/:id", isAuth, productController.getById);
router.post("/", isAuth, multerConfig, productController.create);
router.put("/:id", isAuth, productController.findByIdAndUpdate);
router.delete("/:id", isAuth, productController.findByIdAndDelete);

export default router;
