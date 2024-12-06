import { Router } from "express";
import * as townsipController from "../controllers/townshipController";
import isAuth from "../middleware/authMiddleware";

const router = Router();

router.get("/", townsipController.getALL);
router.get("/city/:id", townsipController.getByCityId);
router.get("/:id", townsipController.getById);

router.post("/", isAuth, townsipController.create);
router.put("/:id", isAuth, townsipController.findByIdAndUpdate);
router.delete("/:id", isAuth, townsipController.findByIdAndDelete);

export default router;
