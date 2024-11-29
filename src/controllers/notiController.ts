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

export const getAllNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const type = (req.query.type as string) || "order";

    const { data, total } = await notiService.getAllNotification(type);

    return sendResponse(
      res,
      data,
      StatusCodes.OK,
      ResponseMessages.SUCCESS,
      total
    );
  } catch (error) {
    return next(error);
  }
};
