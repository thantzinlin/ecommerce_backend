import { Router } from "express";
import * as userController from "../controllers/userController";
import isAuth from "../middleware/authMiddleware";

const router = Router();

router.get("/", isAuth, userController.getUsers);
router.get("/:id", isAuth, userController.getUser);
router.put("/:id", isAuth, userController.updateUser);

export default router;
