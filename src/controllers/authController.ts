import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import { sendResponse } from "../utils/responses";
import { sendEmail } from "../services/emailService";
import { ResponseMessages, StatusCodes } from "../utils/constants";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import token from "../utils/token";
import excludeKey from "../utils/utilFunctions";

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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
    const { email, phone, password } = req.body;

    const user = await authService.findUserByPhone(phone);
    if (!user) {
      return sendResponse(res, {}, StatusCodes.NOT_FOUND, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(
        res,
        {},
        StatusCodes.UNAUTHORIZED,
        "Invalid user or password"
      );
    }

    const authtoken = token.createToken((user._id as string).toString(), user.role);
    const userinfo = excludeKey(user, "password");
    const data = {
      ...userinfo,
      token: authtoken,
    };

    sendResponse(res, data);
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
    return sendResponse(res, user, StatusCodes.CREATED);
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { to, subject, text, html } = req.body;

    const user = await authService.findUserByEmail(to);
    if (!user) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    }

    const resettoken = jwt.sign(
      { email: to },
      process.env.JWT_SECRET || "jdwiejrdcsjwoe",
      { expiresIn: "1h" }
    );

    await sendEmail(to, resettoken, html);

    return sendResponse(res);
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resettoken, newpassword } = req.body;
    let decoded: any;
    try {
      decoded = jwt.verify(
        resettoken,
        process.env.JWT_SECRET || "jdwiejrdcsjwoe"
      );
    } catch (err) {
      return sendResponse(
        res,
        {},
        StatusCodes.UNAUTHORIZED,
        "Invalid or expired reset token"
      );
    }

    const email = decoded.email;
    const user = await authService.findUserByEmail(email);
    if (!user) {
      return sendResponse(
        res,
        {},
        StatusCodes.NOT_FOUND,
        ResponseMessages.NOT_FOUND
      );
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    user.password = hashedPassword;

    await user.save();

    return sendResponse(res);
  } catch (error) {
    return next(error);
  }
};
