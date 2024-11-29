import mongoose from "mongoose";
import { Product } from "../models/product";

export const getAll = async (
  skip: number,
  limit: number,
  search: string = ""
): Promise<{
  data: any[];
  total: number;
  pageCounts: number;
}> => {
  const query: any = { isDeleted: false };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Product.countDocuments(query);
  const pageCounts = Math.ceil(total / limit);

  const data = await Product.aggregate([
    { $match: query },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category", // Unwind to handle array of categories, if necessary
        preserveNullAndEmptyArrays: true, // Optional: Include products without a category
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: {
          $cond: {
            if: { $gt: [{ $size: "$reviews" }, 0] },
            then: { $avg: "$reviews.rating" },
            else: 0,
          },
        },
        totalReviews: { $size: "$reviews" },
      },
    },
    {
      $project: {
        name: 1,
        images: 1,
        stockQuantity: 1,
        description: 1,
        price: 1,
        categoryId: 1,
        categoryName: "$category.name",
        reviews: 1,
        averageRating: 1,
        totalReviews: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]).exec();

  return {
    data,
    total,
    pageCounts,
  };
};

export const getByIdWithReview = async (
  id: string
): Promise<Product | null> => {
  const productWithReviews = await Product.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id), isDeleted: false },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: {
          $cond: {
            if: { $gt: [{ $size: "$reviews" }, 0] },
            then: { $avg: "$reviews.rating" },
            else: 0,
          },
        },
        totalReviews: { $size: "$reviews" },
      },
    },
    {
      $project: {
        name: 1,
        images: 1,
        stockQuantity: 1,
        description: 1,
        price: 1,
        reviews: 1,
        averageRating: 1,
        totalReviews: 1,
      },
    },
  ]).exec();

  return productWithReviews[0] || null;
};

export const getById = async (id: string): Promise<Product | null> => {
  return Product.findById(id);
};

export const getByCategoryId = async (
  categoryId: string
): Promise<Product[]> => {
  return Product.find({ categoryId }).exec();
};

export const findByIdAndUpdate = async (
  id: string,
  data: Partial<Product>
): Promise<Product | null> => {
  return Product.findByIdAndUpdate(id, data, { new: true });
};

export const findByIdAndDelete = async (
  id: string
): Promise<Product | null> => {
  return Product.findByIdAndDelete(id);
};

export const create = async (data: Product): Promise<Product> => {
  const product = new Product(data);
  return product.save();
};
