import { Users } from "../models/user";
import bcrypt from "bcrypt";
import token from "../utils/token";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const authtoken = token.createToken(user);

  return authtoken;
};

export const createUser = async (userData: Users): Promise<Users> => {
  const user = new Users(userData);
  return user.save();
};
