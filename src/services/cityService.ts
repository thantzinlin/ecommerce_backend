import mongoose from "mongoose";
import { City, ICity } from "../models/city";

export const getAll = async (
  skip: number,
  limit: number,
  search: string = ""
): Promise<{
  data: ICity[];
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
  const total = await City.countDocuments(query);
  const pageCounts = Math.ceil(total / limit);
  const data = await City.find(query)
    .select("name")
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

export const getById = async (id: string): Promise<ICity | null> => {
  return City.findById(id);
};

export const findByIdAndUpdate = async (
  id: string,
  data: Partial<ICity>
): Promise<ICity | null> => {
  return City.findByIdAndUpdate(id, data, { new: true });
};

export const findByIdAndDelete = async (id: string): Promise<ICity | null> => {
  return City.findByIdAndDelete(id);
};

export const create = async (data: ICity): Promise<ICity> => {
  const city = new City(data);
  return city.save();
};
