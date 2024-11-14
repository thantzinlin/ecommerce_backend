import { Cart } from "../models/cart";

export const create = async (data: Cart): Promise<Cart> => {
  const cart = new Cart(data);
  return cart.save();
};
