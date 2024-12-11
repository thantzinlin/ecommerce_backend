import * as cartService from "../services/cartService";
import { sendResponse } from "../utils/responses";
import { ResponseMessages, StatusCodes } from "../utils/constants";
import { NextFunction, Request, Response } from "express";
import { IUsers, Users } from "../models/user";
interface RequestWithUser extends Request {
  user?: IUsers;
}
export const addToCart = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, productId, quantity, action } = req.body;
    const cart = await cartService.addToCartService(
      userId,
      productId,
      quantity,
      action
    );
    const count = await getCartItemCountByUserId(req.body.userId);
    return sendResponse(res, count, StatusCodes.CREATED);
  } catch (error) {
    return next(error);
  }
};

export const getCartItemCount = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const count = await getCartItemCountByUserId(req.body.userId);

    return sendResponse(res, count, StatusCodes.CREATED);
  } catch (error) {
    return next(error);
  }
};

export const getCartItemCountByUserId = async (
  userId: string
): Promise<number> => {
  try {
    const cart = await cartService.getCartItemCount(userId);

    if (!cart || cart.products.length === 0) {
      return 0;
    }
    const totalQuantity = cart.products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    return totalQuantity;
  } catch (error) {
    throw new Error("Error fetching cart item count");
  }
};

export const getCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cart = await cartService.getCartItem(req.body.userId);
    if (!cart) {
      sendResponse(res, {}, StatusCodes.NOT_FOUND, ResponseMessages.NOT_FOUND);
    } else {
      const formattedData = {
        ...cart,
        products: cart.products.map((item: any) => ({
          ...item.productId,
          quantity: item.quantity,
          itemId: item._id,
        })),
      };
      return sendResponse(res, formattedData);
    }
  } catch (error) {
    return next(error);
  }
};
