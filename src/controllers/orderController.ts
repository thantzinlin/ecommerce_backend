import { NextFunction, Request, Response } from "express";
import * as orderService from "../services/orderService";
import * as notiService from "../services/notiService";
import { sendResponse } from "../utils/responses";
import { ResponseMessages, StatusCodes } from "../utils/constants";
import { io } from "../server";

export const getALL = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;
    const search = (req.query.search as string) || "";
    const skip = (page - 1) * perPage;

    const { data, total, pageCounts } = await orderService.getAll(
      skip,
      perPage,
      search
    );

    sendResponse(
      res,
      data,
      StatusCodes.OK,
      ResponseMessages.SUCCESS,
      total,
      pageCounts
    );
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
    const data = await orderService.getById(req.params.id);
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
    const data = await orderService.findByIdAndUpdate(req.params.id, req.body);
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
    const data = await orderService.findByIdAndDelete(req.params.id);
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
    const order = await orderService.create(req.body);
    let userId = "admin";
    let message = "test";
    const notificationData: any = {
      userId: "admin", // You can adjust this as needed
      message: `New order received: ${order.id}`, // Customize message with order details
      isRead: false, // Default to unread
    };

    const notification = await notiService.create(notificationData);
    // io.to("admin").emit("newOrder", notificationData);
    io.emit("newOrder", notificationData);

    sendResponse(res, order, StatusCodes.CREATED);
  } catch (error) {
    return next(error);
  }
};
