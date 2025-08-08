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

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),

  body().custom((value) => {
    if (value.startDate && value.endDate) {
      const start = new Date(value.startDate);
      const end = new Date(value.endDate);
      if (start > end) {
        throw new Error("Start date must not be after end date");
      }
    }
    return true;
  }),
];
