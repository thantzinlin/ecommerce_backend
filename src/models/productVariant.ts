import mongoose, { Schema, Document } from "mongoose";

export interface ProductVariant extends Document {
  productId: mongoose.Types.ObjectId;
  size: string;
  color: string;
  sku: string;
  price: number;
  stockQuantity: number;
  images?: string[];
}

const ProductVariantSchema: Schema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size: { type: String, required: true },
    color: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    images: [String],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create a compound index for unique SKU per product
ProductVariantSchema.index({ productId: 1, sku: 1 }, { unique: true });

export const ProductVariant = mongoose.model<ProductVariant>("ProductVariant", ProductVariantSchema);
