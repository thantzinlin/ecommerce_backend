import { Router } from "express";
import * as authController from "../controllers/authController";

const router = Router();

router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/register", authController.createUser);
router.post("/forgotpassword", authController.forgotPassword);
router.post("/resetpassword", authController.resetPassword);

export default router;
