import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import isAuth from "../middleware/authMiddleware";

const router = Router();

router.get("/", isAuth, categoryController.getALL);
router.get("/:id", isAuth, categoryController.getById);
router.post("/", isAuth, categoryController.create);
router.put("/:id", isAuth, categoryController.findByIdAndUpdate);
router.delete("/:id", isAuth, categoryController.findByIdAndDelete);

export default router;
