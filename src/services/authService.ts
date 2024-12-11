import { IUsers, Users } from "../models/user";
import bcrypt from "bcrypt";
import token from "../utils/token";

export const createUser = async (userData: IUsers): Promise<IUsers> => {
  const user = new Users(userData);
  return user.save();
};

export const findUserByEmail = async (
  email: string
): Promise<IUsers | null> => {
  return await Users.findOne({ email }).lean();
};

export const findUserByPhone = async (
  phone: string
): Promise<IUsers | null> => {
  return await Users.findOne({ phone }).lean();
};

export const findUserByUserId = async (
  userId: string
): Promise<IUsers | null> => {
  return await Users.findOne({ userId });
};
