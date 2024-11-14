import * as cartService from "../services/cartService";
import { sendResponse } from "../utils/responses";
import { StatusCodes } from "../utils/constants";
import { NextFunction, Request, Response } from "express";
import { Users } from "../models/user";
interface RequestWithUser extends Request {
  user?: Users;
}
export const create = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    //console.log("userId in req.body ---", req.body.userId);

    const cart = await cartService.create(req.body);
    sendResponse(res, cart, StatusCodes.CREATED);
  } catch (error) {
    return next(error);
  }
};
