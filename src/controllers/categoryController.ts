import { NextFunction, Request, Response } from "express";
import * as categoryService from "../services/categoryService";
import { sendResponse } from "../utils/responses";
import { ResponseMessages, StatusCodes } from "../utils/constants";

export const getALL = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const data = await categoryService.getAll(skip, limit);
    sendResponse(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await categoryService.getById(req.params.id);
    if (!data) {
      sendResponse(res, {}, StatusCodes.NOT_FOUND, ResponseMessages.NOT_FOUND);
    } else {
      sendResponse(res, data);
    }
  } catch (error) {
    return next(error);
  }
};

export const findByIdAndUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await categoryService.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!data) {
      sendResponse(res, {}, StatusCodes.NOT_FOUND, ResponseMessages.NOT_FOUND);
    } else {
      sendResponse(res);
    }
  } catch (error) {
    return next(error);
  }
};

export const findByIdAndDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await categoryService.findByIdAndDelete(req.params.id);
    if (!data) {
      sendResponse(res, {}, StatusCodes.NOT_FOUND, ResponseMessages.NOT_FOUND);
    } else {
      sendResponse(res);
    }
  } catch (error) {
    return next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await categoryService.create(req.body);
    sendResponse(res, category, StatusCodes.CREATED);
  } catch (error) {
    return next(error);
  }
};
