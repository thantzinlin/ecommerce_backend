import { Router } from "express";
import * as orderController from "../controllers/orderController";
//import * as bookingController from "../controllers/bookingController";

import isAuth from "../middleware/authMiddleware";

const router = Router();

router.get("/", isAuth, orderController.getALL);
router.get("/getByUserId", isAuth, orderController.getOrdersByUserId);
router.get("/cancel", isAuth, orderController.getOrdersByStatus);

router.get("/:id", isAuth, orderController.getById);
router.post("/", isAuth, orderController.create);

router.put("/:id", isAuth, orderController.findByIdAndUpdate);
router.delete("/:id", isAuth, orderController.findByIdAndDelete);
//router.post("/book", bookingController.createBooking);

export default router;
