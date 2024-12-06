import { Router } from "express";
import * as cityController from "../controllers/cityController";
import isAuth from "../middleware/authMiddleware";

const router = Router();

router.get("/", cityController.getALL);
router.get("/:id", cityController.getById);
router.post("/", isAuth, cityController.create);
router.put("/:id", isAuth, cityController.findByIdAndUpdate);
router.delete("/:id", isAuth, cityController.findByIdAndDelete);

export default router;
