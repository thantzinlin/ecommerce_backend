import mongoose from "mongoose";
import { Cart } from "../models/cart";
import { Product } from "../models/product";

export const getCartItem = async (userId: string): Promise<Cart | null> => {
  const cart = await Cart.findOne({ userId })
    .populate({
      path: "products.productId",
      model: "Product",
      select: "name price description images",
    })
    .lean();

  return cart;
};

export const addToCartService = async (
  userId: string,
  productId: string,
  quantity: number,
  action: string
) => {
  const productObjectId = new mongoose.Types.ObjectId(productId);
  const product = await Product.findById(productObjectId);
  if (!product) {
    throw new Error("Product not found");
  }
  let cart = await Cart.findOne({ userId });
  if (cart) {
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex > -1) {
      if (action === "increase") {
        cart.products[productIndex].quantity += quantity;
      } else if (action === "decrease") {
        cart.products[productIndex].quantity -= quantity;
      } else if (action === "update") {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }
    } else {
      cart.products.push({ productId: productObjectId, quantity });
    }
  } else {
    cart = new Cart({
      userId,
      products: [{ productId: productObjectId, quantity }],
    });
  }
  return await cart.save();
};

export const getCartItemCount = async (userId: string) => {
  const cart = await Cart.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });
  if (!cart) {
    return null;
  }
  return cart;
};
