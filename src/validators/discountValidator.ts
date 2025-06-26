import { body } from "express-validator";

export const validateAddDiscount = [
  body("name")
    .notEmpty()
    .withMessage("Discount name is required")
    .isString()
    .withMessage("Discount name must be a string"),

  body("discountType")
    .notEmpty()
    .withMessage("Discount Type is required")
    .isString()
    .withMessage("Discount Type must be a string"),

  // body("value")
  //   .notEmpty()
  //   .withMessage("Discount value is required")
  //   .bail()
  //   .custom((value) => {
  //     if (typeof value !== "number") {
  //       throw new Error("Discount value must be a number (not a string)");
  //     }
  //     return true;
  //   }),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),
];
