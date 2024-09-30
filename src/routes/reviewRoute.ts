import { Router } from "express";
import * as reviewController from "../controllers/reviewController";
import isAuth from "../middleware/authMiddleware";

const router = Router();

router.get("/", isAuth, reviewController.getALL);
router.get("/:id", isAuth, reviewController.getById);
router.post("/", isAuth, reviewController.create);
router.put("/:id", isAuth, reviewController.findByIdAndUpdate);
router.delete("/:id", isAuth, reviewController.findByIdAndDelete);

export default router;
