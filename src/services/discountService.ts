import { Discount, IDiscount } from "../models/discount";
import { Product } from "../models/product";

export const createDiscountWithProducts = async (discountData: any) => {
  const discount = await Discount.create(discountData);
  const targets = discountData.targets;

  if (targets && targets.length > 0) {
    await Product.updateMany(
      { _id: { $in: targets } },
      { $set: { discountId: discount._id } }
    );
  }

  return discount;
};

export const getAll = async (
  skip: number,
  limit: number,
  search: string = ""
): Promise<{
  data: any[];
  total: number;
  pageCounts: number;
}> => {
  const query: any = { isActive: true };

  if (search) {
    query.$or = [{ name: { $regex: search, $options: "i" } }];
  }
  const total = await Discount.countDocuments(query);
  const pageCounts = Math.ceil(total / limit);
  const data = await Discount.find(query)
    .skip(skip)
    .limit(limit)

    .lean()
    .exec();

  return {
    data,
    total,
    pageCounts,
  };
};

export const getById = async (id: string): Promise<IDiscount | null> => {
  return Discount.findById(id);
};

export const findByIdAndUpdate = async (id: string, data: any) => {
  const targets = data.targets;

  if (targets && targets.length > 0) {
    await Product.updateMany(
      { _id: { $in: targets } },
      { $set: { discountId: id } }
    );
  }
  return Discount.findByIdAndUpdate(id, data, { new: true });
};

export const findByIdAndDelete = async (
  id: string
): Promise<IDiscount | null> => {
  return Discount.findByIdAndUpdate(id, { isActive: false }, { new: true });
};
