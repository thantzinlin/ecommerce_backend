import { Counter } from "../models/counter";
import { Order } from "../models/order";

export const getAll = async (
  filters: {
    fromDate?: string;
    toDate?: string;
    page?: string;
    perPage?: string;
    orderStatus?: string;
    paymentStatus?: string;
    search?: string;
  } = {},
  skip?: number,
  limit?: number,
): Promise<{
  data: any[];
  total: number;
  pageCounts: number;
}> => {
  const query: any = { isDeleted: false };

  // Apply filters dynamically
  if (filters.fromDate && filters.toDate) {
    query.orderDate = {
      $gte: new Date(filters.fromDate),
      $lte: new Date(filters.toDate),
    };
  }
  if (filters.orderStatus) {
    query.orderStatus = filters.orderStatus;
  }
  if (filters.paymentStatus) {
    query.paymentStatus = filters.paymentStatus;
  }

  // Search condition
  const searchCondition = filters.search
    ? {
        $or: [
          { orderNumber: { $regex: filters.search, $options: "i" } },
          { "user.username": { $regex: filters.search, $options: "i" } },
        ],
      }
    : {};

  // Aggregation pipeline for both total count and data retrieval
  const aggregationPipeline: any[] = [
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
      $match: { ...query, ...searchCondition } 
    }
  ];

  // Get total count in one query
  const [countResult] = await Order.aggregate([
    ...aggregationPipeline,
    { $count: "total" },
  ]);
  const total = countResult ? countResult.total : 0;

  // Add sorting and projection to main query
  aggregationPipeline.push(
    { $sort: { orderDate: -1 } },
    {
      $project: {
        _id: 1,
        customerName: "$user.username",
        orderNumber: 1,
        orderStatus: 1,
        totalAmount: 1,
        paymentMethod: 1,
        paymentStatus: 1,
        orderDate: 1,
        shippingAddress: 1,
      },
    }
  );

  // Apply pagination if required
  if (typeof skip === 'number' && typeof limit === 'number') {
    aggregationPipeline.push({ $skip: skip }, { $limit: limit });
  }

  // Execute the optimized aggregation
  const data = await Order.aggregate(aggregationPipeline).exec();

  return {
    data,
    total,
    pageCounts: limit ? Math.ceil(total / limit) : 1,
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
export const getOrdersForReport = async ({
  dateRange,
  status,
  paymentStatus,
  search
}: {
  dateRange: string;
  status: string;
  paymentStatus: string;
  search: string;
}): Promise<Order[]> => {
  const query: any = { isDeleted: false };

  // Handle date range filter
  if (dateRange) {
    const [startDate, endDate] = dateRange.split(',');
    query.orderDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  // Handle order status filter
  if (status) {
    query.orderStatus = status;
  }

  // Handle payment status filter
  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  // Handle search
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: "i" } },
      { "user.username": { $regex: search, $options: "i" } }
    ];
  }

  const orders = await Order.aggregate([
    { $match: query },
    { $sort: { orderDate: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        orderNumber: 1,
        username: "$user.username",
        orderStatus: 1,
        paymentStatus: 1,
        totalPrice: 1,
        orderDate: 1,
        products: 1,
        shippingAddress: 1
      }
    }
  ]).exec();

  return orders;
};
