import { Router } from "express";
import * as userController from "../controllers/userController";
import isAuth from "../middleware/authMiddleware";

const router = Router();

router.get("/", isAuth, userController.getUsers);
router.get("/:id", isAuth, userController.getUser);
// router.post("/", userController.createUser);
router.put("/:id", isAuth, userController.updateUser);
// router.delete("/:id", isAuth, userController.deleteUser);

export default router;
