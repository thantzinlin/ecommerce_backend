import mongoose, { Schema, Document } from "mongoose";

export interface IDiscount extends Document {
  name: string;
  description?: string;
  discountType: "percentage" | "fixed";
  targets: mongoose.Types.ObjectId[];
  value: number;
  startDate: Date;
  endDate: Date;
  minPurchase: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  cuponCode: string;
  isPublic?: boolean;
  isActive: boolean;
}

const DiscountSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    targets: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    value: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    minPurchase: { type: Number },
    usageLimit: { type: Number, default: 0 },
    cuponCode: { type: String, default: "" },
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Discount = mongoose.model<IDiscount>("Discount", DiscountSchema);
