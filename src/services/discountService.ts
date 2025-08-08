import mongoose from "mongoose";
import { Discount, IDiscount } from "../models/discount";
import { Product } from "../models/product";

export const createDiscountWithProducts = async (discountData: any) => {
  const targets = discountData.targets;

  if (targets && targets.length > 0) {
    await checkProductDiscountConflicts(
      targets,
      discountData.startDate,
      discountData.endDate
    );
  }

  const discount = await Discount.create(discountData);

  if (targets && targets.length > 0) {
    await Product.updateMany(
      { _id: { $in: targets } },
      { $set: { discountId: discount._id } }
    );
  }

  return discount;
};

export const checkProductDiscountConflicts = async (
  targets: string[],
  startDate: string,
  endDate: string
) => {
  const conflictingProducts = await Product.aggregate([
    {
      $match: {
        _id: { $in: targets.map((id) => new mongoose.Types.ObjectId(id)) },
        discountId: { $ne: null },
      },
    },
    {
      $lookup: {
        from: "discounts",
        localField: "discountId",
        foreignField: "_id",
        as: "discount",
      },
    },
    { $unwind: "$discount" },
    {
      $match: {
        "discount.isActive": true,
        $expr: {
          $and: [
            { $lte: [{ $toDate: "$discount.startDate" }, new Date(endDate)] },
            { $gte: [{ $toDate: "$discount.endDate" }, new Date(startDate)] },
          ],
        },
      },
    },
  ]);

  if (conflictingProducts.length > 0) {
    const productNames = conflictingProducts.map((p) => p.name).join(", ");
    throw new Error(
      `The following products already have a conflicting discount within the selected date range: ${productNames}`
    );
  }
};

export const getByCuponCode = async (
  cuponCode: string
): Promise<IDiscount | null> => {
  return Discount.findOne({ cuponCode, isActive: true, isPublic: false });
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
    await checkProductDiscountConflicts(targets, data.startDate, data.endDate);
  }
  await Product.updateMany({ discountId: id }, { $unset: { discountId: "" } });

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
