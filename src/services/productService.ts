import { Product } from "../models/product";

export const getAll = async (
  skip: number,
  limit: number,
  search: string = ""
): Promise<{
  data: Product[];
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
  const data = await Product.find(query).skip(skip).limit(limit).exec();

  return {
    data,
    total,
    pageCounts,
  };
};

export const getAll1 = async (
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
      $project: {
        name: 1,
        description: 1,
        price: 1,
        categoryId: 1,
        categoryName: "$category.name",
      },
    },
  ]).exec();

  return {
    data,
    total,
    pageCounts,
  };
};

export const getById = async (id: string): Promise<Product | null> => {
  return Product.findById(id);
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
