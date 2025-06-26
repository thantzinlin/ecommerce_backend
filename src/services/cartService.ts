import mongoose from "mongoose";
import { Cart, ICart } from "../models/cart";
import { Product } from "../models/product";

export const getCartItem = async (cartId: string): Promise<ICart | null> => {
  const cart = await Cart.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(cartId) },
    },
    {
      $unwind: "$products",
    },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "productData",
      },
    },
    {
      $unwind: "$productData",
    },
    {
      $lookup: {
        from: "discounts",
        localField: "productData.discountId",
        foreignField: "_id",
        as: "discountData",
      },
    },
    // Extract selectedVariant from product.variants using variantId
    {
      $addFields: {
        selectedVariant: {
          $first: {
            $filter: {
              input: "$productData.variants",
              as: "variant",
              cond: {
                $eq: ["$$variant._id", "$products.variantId"],
              },
            },
          },
        },
      },
    },
    // Use selectedVariant.price if exists, otherwise productData.price
    {
      $addFields: {
        price: {
          $cond: [
            { $ifNull: ["$selectedVariant.price", false] },
            "$selectedVariant.price",
            "$productData.price",
          ],
        },
      },
    },
    // Calculate discountedPrice from price
    {
      $addFields: {
        discountedPrice: {
          $cond: [
            { $eq: [{ $size: "$discountData" }, 0] },
            0,
            {
              $cond: [
                {
                  $eq: [
                    { $arrayElemAt: ["$discountData.discountType", 0] },
                    "percentage",
                  ],
                },
                {
                  $subtract: [
                    "$price",
                    {
                      $multiply: [
                        "$price",
                        {
                          $divide: [
                            { $arrayElemAt: ["$discountData.value", 0] },
                            100,
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  $cond: [
                    {
                      $eq: [
                        { $arrayElemAt: ["$discountData.discountType", 0] },
                        "fixed",
                      ],
                    },
                    {
                      $subtract: [
                        "$price",
                        { $arrayElemAt: ["$discountData.value", 0] },
                      ],
                    },
                    0,
                  ],
                },
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        userId: { $first: "$userId" },
        products: {
          $push: {
            productId: "$products.productId",
            variantId: "$products.variantId",
            quantity: "$products.quantity",
            product: "$productData",
            variant: "$selectedVariant",
            price: "$price",
            discountedPrice: "$discountedPrice",
          },
        },
      },
    },
  ]);

  return cart[0] || null;
};

export const addToCartService = async (
  cartId: string,
  productId: string,
  variantId: string | null,
  quantity: number,
  action: string
): Promise<string> => {
  const productObjectId = new mongoose.Types.ObjectId(productId);

  const product = await Product.findById(productObjectId);
  if (!product) {
    throw new Error("Product not found");
  }

  let availableStock = product.stockQuantity;

  let variantObjectId: mongoose.Types.ObjectId | null = null;
  let variant = null;

  if (variantId && product.variants && product.variants.length > 0) {
    variantObjectId = new mongoose.Types.ObjectId(variantId);
    variant = product.variants.find((v: any) => v._id.toString() === variantId);

    if (!variant) {
      throw new Error("Product variant not found");
    }

    availableStock = variant.stockQuantity;
  }

  // Check if quantity is available (unless removing)
  if (action !== "remove" && availableStock < quantity) {
    throw new Error(`Only ${availableStock} item(s) left in stock.`);
  }

  // Fetch or create cart
  let cart = await Cart.findOne({ _id: new mongoose.Types.ObjectId(cartId) });

  if (cart) {
    const productIndex = cart.products.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        (!variantId || item.variantId?.toString() === variantId)
    );

    if (productIndex > -1) {
      // Existing item in cart
      const currentQty = cart.products[productIndex].quantity;

      if (action === "increase") {
        const newQty = currentQty + quantity;
        if (newQty > availableStock) {
          throw new Error(`Only ${availableStock} item(s) available.`);
        }
        cart.products[productIndex].quantity = newQty;
      } else if (action === "decrease") {
        cart.products[productIndex].quantity = currentQty - quantity;
      } else if (action === "update") {
        const newQty = currentQty + quantity;
        if (newQty > availableStock) {
          throw new Error(`Only ${availableStock} item(s) available.`);
        }
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }
    } else if (action !== "remove") {
      // New item
      cart.products.push({
        productId: productObjectId,
        variantId: variantObjectId ?? undefined,
        quantity,
      });
    }
  } else {
    cart = new Cart({
      products: [
        {
          productId: productObjectId,
          variantId: variantObjectId ?? undefined,
          quantity,
        },
      ],
    });
  }

  const data = await cart.save();
  return (data as { _id: mongoose.Types.ObjectId })._id.toString();
};

export const getCartItemCount = async (Id: string) => {
  const cart = await Cart.findOne({
    _id: new mongoose.Types.ObjectId(Id),
  });
  if (!cart) {
    return null;
  }
  return cart;
};

export const deleteCartById = async (cartId: string) => {
  try {
    const deletedCart = await Cart.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(cartId),
    });
  } catch (err) {
    console.error("Error deleting cart:", err);
  }
};
