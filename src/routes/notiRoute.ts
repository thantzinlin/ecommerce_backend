import { Router } from "express";
import * as notiController from "../controllers/notiController";
import isAuth from "../middleware/authMiddleware";

const router = Router();

router.get("/count", isAuth, notiController.getUnreadCount);
router.get("/", isAuth, notiController.getAllNotification);

export default router;
