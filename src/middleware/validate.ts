import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { sendResponse } from "../utils/responses";
import { StatusCodes } from "../utils/constants";

export const handleValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array();
    return sendResponse(res, error, StatusCodes.BAD_REQUEST, error[0].msg);
  }
  next();
};
