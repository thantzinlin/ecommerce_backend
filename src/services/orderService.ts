import { Counter } from "../models/counter";
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
    { $sort: { orderDate: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        username: "$user.username",
        orderNumber: 1,
        orderStatus: 1,
        totalPrice: 1,
        paymentMethod: 1,
        status: 1,
        orderDate: 1,
        shippingAddress: 1,
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
  const order: any = await Order.findById(id)
    .populate({
      path: "products.productId",
      select: "name images",
    })
    .lean() // Converts Mongoose document to a plain JS object
    .exec();

  if (!order) return null;

  // Flatten product details
  order.products = order.products.map((product: any) => ({
    productName: product.productId.name,
    imageurl: product.productId.images[0],
    quantity: product.quantity,
    price: product.price,
    discount: product.discount,
    subtotal: product.subtotal,
  }));

  return order;
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

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const orders = await Order.find({ userId })
    .select("orderNumber products orderDate orderStatus totalPrice")
    .populate({
      path: "products.productId",
      select: "name images",
    })
    .exec();

  if (!orders) return [];

  return orders.map((order: any) => ({
    ...order.toObject(),
    products: order.products.map((product: any) => ({
      _id: product._id,
      name: product.productId.name,
      images: product.productId.images,
      quantity: product.quantity,
      price: product.price,
      discount: product.discount,
      subtotal: product.subtotal,
    })),
  }));
};

export const getOrdersByStatus = async (
  userId: string,
  orderStatus: string
): Promise<Order[]> => {
  const orders = await Order.find({ userId, orderStatus })
    .select("orderNumber products orderDate orderStatus totalPrice")
    .populate({
      path: "products.productId",
      select: "name images",
    })
    .exec();

  if (!orders) return [];

  return orders.map((order: any) => ({
    ...order.toObject(),
    products: order.products.map((product: any) => ({
      _id: product._id,
      name: product.productId.name,
      image: product.productId.images[0],
      quantity: product.quantity,
      price: product.price,
      discount: product.discount,
      subtotal: product.subtotal,
    })),
  }));
};

export const generateOrderNumber = async (): Promise<string> => {
  const today = new Date().toISOString().split("T")[0].replace(/-/g, "");

  let counter = await Counter.findOne({ date: today });

  if (!counter) {
    counter = new Counter({ date: today, sequence: 1 });
    await counter.save();
  } else {
    counter.sequence += 1;
    await counter.save();
  }

  const formattedSequence = counter.sequence.toString().padStart(6, "0");
  return `ORD-${today}-${formattedSequence}`;
};
