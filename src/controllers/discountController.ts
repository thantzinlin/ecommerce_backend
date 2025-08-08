import { NextFunction, Request, Response } from "express";
import * as discountService from "../services/discountService";
import { sendResponse } from "../utils/responses";
import { ResponseMessages, StatusCodes } from "../utils/constants";
import { Product } from "../models/product";

export const addDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const discountData = await discountService.createDiscountWithProducts(
      req.body
    );

    return sendResponse(res, discountData, StatusCodes.CREATED);
  } catch (error) {
    return next(error);
  }
};
export const applyCupon = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { cuponCode, cartTotal } = req.body;

    const coupon = await discountService.getByCuponCode(cuponCode);
    const now = new Date();

    if (!coupon) {
      return sendResponse(
        res,
        {},
        StatusCodes.RESOURCE_NOT_FOUND,
        "Invalid coupon code"
      );
    }

    if (coupon.startDate && now < coupon.startDate) {
      return sendResponse(
        res,
        {},
        StatusCodes.BAD_REQUEST,
        "Coupon is not active yet"
      );
    }

    if (coupon.endDate && now > coupon.endDate) {
      return sendResponse(
        res,
        {},
        StatusCodes.BAD_REQUEST,
        "Coupon has expired"
      );
    }

    if (cartTotal < coupon.minPurchase) {
      return sendResponse(
        res,
        {},
        StatusCodes.BAD_REQUEST,
        `Minimum cart value should be ${coupon.minPurchase}`
      );
    }

    if (coupon.startDate && now < coupon.startDate) {
      return sendResponse(
        res,
        {},
        StatusCodes.BAD_REQUEST,
        "Coupon is not active yet"
      );
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return sendResponse(
        res,
        {},
        StatusCodes.BAD_REQUEST,
        "Coupon usage limit exceeded"
      );
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    const discountedAmount = cartTotal - discount;

    return sendResponse(res, {
      cupon: cuponCode,
      discountedAmount,
      discount,
    });
  } catch (error) {
    return next(error);
  }
};

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

    const { data, total, pageCounts } = await discountService.getAll(
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
    const data = await discountService.getById(req.params.id);
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
    const data = await discountService.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!data) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    } else {
      return sendResponse(res, data, StatusCodes.OK, ResponseMessages.SUCCESS);
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
    const data = await discountService.findByIdAndDelete(req.params.id);
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
