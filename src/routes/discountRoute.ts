import { Router } from "express";
import * as discountController from "../controllers/discountController";
import isAuth from "../middleware/authMiddleware";
import { validateAddDiscount } from "../validators/discountValidator";
import { handleValidation } from "../middleware/validate";

const router = Router();

router.post(
  "/",
  isAuth,
  validateAddDiscount,
  handleValidation,
  discountController.addDiscount
);
router.post("/applyCupon", discountController.applyCupon);
router.get("/", isAuth, discountController.getALL);
router.get("/:id", isAuth, discountController.getById);
router.put(
  "/:id",
  isAuth,
  validateAddDiscount,
  handleValidation,
  discountController.findByIdAndUpdate
);
router.delete("/:id", isAuth, discountController.findByIdAndDelete);

export default router;
