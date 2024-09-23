import { User } from "../models/userModel";

export const getAllUsers = async (): Promise<User[]> => {
  return User.find();
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
