import { NextFunction, Request, Response } from "express";
import * as userService from "../services/userService";
import { sendResponse } from "../utils/responses";
import { ResponseMessages, StatusCodes } from "../utils/constants";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const data = await userService.getAllUsers(skip, limit);
    return sendResponse(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await userService.getUserById(req.params.id);
    if (!data) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    } else {
      return sendResponse(res, data);
    }
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await userService.updateUser(req.params.id, req.body);
    if (!data) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    } else {
      return sendResponse(res);
    }
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    } else {
      return sendResponse(res);
    }
  } catch (error) {
    return next(error);
  }
};
