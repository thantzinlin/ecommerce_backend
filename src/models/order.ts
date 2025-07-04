import mongoose, { Schema, Document } from "mongoose";

export interface Order extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  products: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    // imageurl: string;
    discount: number;
    subtotal: number;
  }[];
  tax: number;
  shippingCharge: number;
  subTotal: number;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  orderDate: Date;
  shippingAddress: {
    city: string;
    township: string;
    street: string;
    postalCode: number;
  };
  billingAddress: {
    city: string;
    township: string;
    street: string;
    postalCode: number;
  };
  notes: string;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        // productName: { type: String, required: true },
        // imageurl: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, required: false },
        subtotal: { type: Number, required: true },
      },
    ],
    tax: { type: Number, default: 0, required: false },
    shippingCharge: { type: Number, default: 0, required: false },
    subTotal: { type: Number, default: 0, required: true },
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, default: "Pending", required: true },
    paymentMethod: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    shippingAddress: {
      city: { type: String, required: true },
      township: { type: String, required: true },
      street: { type: String, required: true },
      postalCode: { type: Number, required: false },
    },
    billingAddress: {
      city: { type: String, required: true },
      township: { type: String, required: true },
      street: { type: String, required: true },
      postalCode: { type: Number, required: false },
    },
    paymentStatus: { type: String, required: false },
    notes: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Order = mongoose.model<Order>("Order", OrderSchema);
