import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import bcrypt from "bcrypt";
import { sendResponse } from "../utils/responses";

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
