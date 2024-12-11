import { IUsers, Users } from "../models/user";

export const getAllUsers = async (
  skip: number,
  limit: number
): Promise<IUsers[]> => {
  return await Users.find().skip(skip).limit(limit).exec();
};

export const getUserById = async (id: string): Promise<IUsers | null> => {
  return Users.findById(id);
};

export const updateUser = async (
  id: string,
  userData: Partial<IUsers>
): Promise<IUsers | null> => {
  return Users.findByIdAndUpdate(id, userData, { new: true });
};

export const deleteUser = async (id: string): Promise<IUsers | null> => {
  return Users.findByIdAndDelete(id);
};
