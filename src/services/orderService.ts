import { Order } from "../models/order";

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

  const total = await Order.countDocuments(query);
  const pageCounts = Math.ceil(total / limit);

  const data = await Order.aggregate([
    { $match: query },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: {
        path: "$product",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        price: 1,
        categoryId: 1,
        categoryName: "$product.name",
      },
    },
  ]).exec();

  return {
    data,
    total,
    pageCounts,
  };
};

export const getById = async (id: string): Promise<Order | null> => {
  return Order.findById(id);
};

export const findByIdAndUpdate = async (
  id: string,
  data: Partial<Order>
): Promise<Order | null> => {
  return Order.findByIdAndUpdate(id, data, { new: true });
};

export const findByIdAndDelete = async (id: string): Promise<Order | null> => {
  return Order.findByIdAndDelete(id);
};

export const create = async (data: Order): Promise<Order> => {
  const order = new Order(data);
  return order.save();
};
