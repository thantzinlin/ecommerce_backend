import mongoose, { Schema, Document } from "mongoose";

export interface ProductVariant {
  size: string;
  color: string;
  weight: number;
  sku: string;
  price: number;
  stockQuantity: number;
  images?: string[];
}

export interface Product extends Document {
  name: string;
  description?: string;
  price: number;
  categoryId: mongoose.Types.ObjectId;
  stockQuantity: number;
  images?: string[];
  variants?: ProductVariant[];
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stockQuantity: { type: Number, required: true },
    images: [String],
    variants: [
      {
        size: { type: String},
        color: { type: String },
        weight: { type: Number},
        sku: { type: String},
        price: { type: Number},
        stockQuantity: { type: Number },
        images: [String],
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create a compound index for unique SKU within variants
ProductSchema.index({ "variants.sku": 1 }, { unique: true });

export const Product = mongoose.model<Product>("Product", ProductSchema);
