import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import isAuth, {  isAdminAuth } from "../middleware/authMiddleware";

const router = Router();
router.get("/getall", isAdminAuth, categoryController.getALLForAdmin);
router.get("/", categoryController.getALL);
router.get("/getBySlug", isAdminAuth,categoryController.getBySlug);
router.get("/:id", categoryController.getById);

//router.get("/:id", categoryController.getById);

router.post("/", isAdminAuth, categoryController.create);
router.put("/:id", isAdminAuth, categoryController.findByIdAndUpdate);
router.delete("/:id", isAdminAuth, categoryController.findByIdAndDelete);

export default router;
