import { Router } from "express";
import * as productController from "../controllers/productController";
import isAuth from "../middleware/authMiddleware";
import upload from "../middleware/multerConfig";

const router = Router();

router.get("/", productController.getALL);
router.get("/:id", isAuth, productController.getById);

router.get("/details/:id", productController.getByIdWithReview);
router.get("/categoryId/:id", productController.getByCategoryId);

router.post("/", isAuth, productController.create);
//router.post("/", isAuth, upload.single('image'), productController.create);

router.put("/:id", isAuth, productController.findByIdAndUpdate);
router.delete("/:id", isAuth, productController.findByIdAndDelete);

export default router;
