import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import bcrypt from "bcrypt";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;

    const token = await authService.login(username, password);

    res.status(200).json({ token });
  } catch (error: any) {
    return next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = {
      ...req.body,
      password: hashedPassword,
    };

    const user = await authService.createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error creating user" });
  }
};
