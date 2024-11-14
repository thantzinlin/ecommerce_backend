import mongoose, { Schema, Document } from "mongoose";

interface CartProduct {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface Cart extends Document {
  userId: mongoose.Types.ObjectId;
  products: CartProduct[];
}

const CartSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model<Cart>("Cart", CartSchema);
