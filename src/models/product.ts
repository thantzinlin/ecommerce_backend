import mongoose, { Document, Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    stock: Number,
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        comment: String,
        reviewedAt: Date
      }
    ]
  });
  
  module.exports = mongoose.model('Product', productSchema);
  