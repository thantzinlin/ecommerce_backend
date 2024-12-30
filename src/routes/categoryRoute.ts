import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import isAuth from "../middleware/authMiddleware";

const router = Router();
router.get("/getall", isAuth, categoryController.getALLForAdmin);
router.get("/", categoryController.getALL);
router.get("/:id", categoryController.getById);
router.get("/:slug", categoryController.getBySlug);

//router.get("/:id", categoryController.getById);

router.post("/", isAuth, categoryController.create);
router.put("/:id", isAuth, categoryController.findByIdAndUpdate);
router.delete("/:id", isAuth, categoryController.findByIdAndDelete);

export default router;
