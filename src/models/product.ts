import mongoose, { Schema, Document } from "mongoose";

export interface Product extends Document {
  name: string;
  description?: string;
  price: number;
  categoryId: mongoose.Types.ObjectId;
  // reviews: mongoose.Types.ObjectId[];
  //reviews: [{ type: mongoose.Schema.Types.ObjectId; ref: "Review" }];

  stockQuantity: number;
  images?: string[];
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
    //reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],

    stockQuantity: { type: Number, required: true },
    images: [String],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = mongoose.model<Product>("Product", ProductSchema);
