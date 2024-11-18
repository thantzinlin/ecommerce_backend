import { NextFunction, Request, Response } from "express";
import * as notiService from "../services/notiService";
import { sendResponse } from "../utils/responses";
import { ResponseMessages, StatusCodes } from "../utils/constants";

export const getUnreadCount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await notiService.getUnreadCount();

    return sendResponse(res, data);
  } catch (error) {
    return next(error);
  }
};
