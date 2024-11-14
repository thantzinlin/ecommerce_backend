import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import bcrypt from "bcrypt";
import { sendResponse } from "../utils/responses";

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Clear the JWT token stored in the HTTP-only cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use 'true' in production
      sameSite: "strict", // Protect against CSRF attacks
      maxAge: 0, // Immediately expire the cookie
    });

    res.status(200).json({
      returncode: "200",
      returnmessage: "Logout successful",
    });
  } catch (error: any) {
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const token = await authService.login(email, password);

    const data: any = {};
    data.token = token;
    res
      .status(200)
      .json({ returncode: "200", returnmessage: "Success", token });
    //sendResponse(res, data);
  } catch (error: any) {
    return next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: Function
): Promise<void> => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = {
      ...req.body,
      password: hashedPassword,
    };

    const user = await authService.createUser(userData);
    sendResponse(res);
  } catch (error) {
    next(error);
  }
};
