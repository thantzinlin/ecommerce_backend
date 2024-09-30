import { User } from "../models/user";

export const getAllUsers = async (
  skip: number,
  limit: number
): Promise<User[]> => {
  return await User.find().skip(skip).limit(limit).exec();
};

export const getUserById = async (id: string): Promise<User | null> => {
  return User.findById(id);
};

export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User | null> => {
  return User.findByIdAndUpdate(id, userData, { new: true });
};

export const deleteUser = async (id: string): Promise<User | null> => {
  return User.findByIdAndDelete(id);
};
