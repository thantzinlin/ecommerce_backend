import { User } from "../models/user";
import bcrypt from "bcrypt";
import token from "../utils/token";

export const login = async (
  username: string,
  password: string
): Promise<string> => {
  const user = await User.findOne({ username });
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

export const createUser = async (userData: User): Promise<User> => {
  const user = new User(userData);
  return user.save();
};
