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
    const { cartId, productId, variantId, quantity, action } = req.body;
    const Id = await cartService.addToCartService(
      cartId,
      productId,
      variantId,
      quantity,
      action
    );
    const count = await getCartItemCountById(Id.toString());
    return sendResponse(
      res,
      { count, cartId: Id.toString() },
      StatusCodes.CREATED
    );
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
    const count = await getCartItemCountById(req.body.userId);

    return sendResponse(res, count, StatusCodes.CREATED);
  } catch (error) {
    return next(error);
  }
};

export const getCartItemCountById = async (Id: string): Promise<number> => {
  try {
    const cart = await cartService.getCartItemCount(Id);

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
    const cart = await cartService.getCartItem(req.query.cartId as string);

    if (!cart) {
      return sendResponse(
        res,
        { products: [] },
        StatusCodes.OK,
        ResponseMessages.NOT_FOUND
      );
    }

    const formattedData = {
      _id: cart._id,
      userId: cart.userId,
      products: cart.products.map((item: any) => ({
        ...item.product,
        quantity: item.quantity,
        itemId: item._id,
        price: item.price,
        variantId: item.variantId,
        discountedPrice: item.discountedPrice,
      })),
    };

    return sendResponse(res, formattedData);
  } catch (error) {
    return next(error);
  }
};
