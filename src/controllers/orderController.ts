import { NextFunction, Request, Response } from "express";
import * as orderService from "../services/orderService";
import * as notiService from "../services/notiService";
import { sendResponse } from "../utils/responses";
import { ResponseMessages, StatusCodes } from "../utils/constants";
import { io } from "../server";
import Counter from "../models/Counter";

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

    return sendResponse(
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

export const findByIdAndUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await orderService.findByIdAndUpdate(req.params.id, req.body);
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

export const findByIdAndDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await orderService.findByIdAndDelete(req.params.id);
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

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderNumber = await generateOrderNumber();
    req.body.orderNumber = orderNumber;

    const order = await orderService.create(req.body);
    const notiData: any = {
      userId: req.body.userId,
      type: "order",
      message: `New order received: ${orderNumber}`,
    };

    await notiService.create(notiData);

    //io.emit("orderNotification", notiData);
    io.to("adminRoom").emit("orderNotification", notiData);

    return sendResponse(res, order, StatusCodes.CREATED);
  } catch (error) {
    return next(error);
  }
};

const generateOrderNumber = async (): Promise<string> => {
  const today = new Date().toISOString().split("T")[0].replace(/-/g, "");

  let counter = await Counter.findOne({ date: today });

  if (!counter) {
    counter = new Counter({ date: today, sequence: 1 });
    await counter.save();
  } else {
    counter.sequence += 1;
    await counter.save();
  }

  const formattedSequence = counter.sequence.toString().padStart(6, "0");
  return `ORD-${today}-${formattedSequence}`;
};
