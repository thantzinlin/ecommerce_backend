import mongoose, { Schema, Document } from "mongoose";

export interface Review extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

export const Review = mongoose.model<Review>("Review", ReviewSchema);
