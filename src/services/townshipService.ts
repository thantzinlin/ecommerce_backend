import mongoose from "mongoose";
import { Township, ITownship } from "../models/township";

export const getAll = async (
  skip: number,
  limit: number,
  search: string = ""
): Promise<{
  data: ITownship[];
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
  const total = await Township.countDocuments(query);
  const pageCounts = Math.ceil(total / limit);

  const data = await Township.find(query)
    .skip(skip)
    .limit(limit)
    .populate("cityId", "name")
    .lean()
    .exec();

  return {
    data,
    total,
    pageCounts,
  };
};

export const getById = async (id: string): Promise<ITownship | null> => {
  return Township.findById(id);
};
export const getByCityId = async (
  cityId: string
): Promise<ITownship[] | null> => {
  return await Township.find({ cityId: new mongoose.Types.ObjectId(cityId) });
};

export const findByIdAndUpdate = async (
  id: string,
  data: Partial<ITownship>
): Promise<ITownship | null> => {
  return Township.findByIdAndUpdate(id, data, { new: true });
};

export const findByIdAndDelete = async (
  id: string
): Promise<ITownship | null> => {
  return Township.findByIdAndDelete(id);
};

export const create = async (data: ITownship): Promise<ITownship> => {
  const township = new Township(data);
  return township.save();
};
