import mongoose, { Document, Schema } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    stock: Number,
    isDeleted: { type: Boolean, default: false },

    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: Number,
        comment: String,
        reviewedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
