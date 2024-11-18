import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import { sendResponse } from "../utils/responses";
import * as crypto from "crypto";
import { sendEmail } from "../services/emailService";
import { ResponseMessages, StatusCodes } from "../utils/constants";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration
    await user.save();
    await sendEmail(to, token, html);

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
    const { token, newPassword } = req.body;

    // Verify the token
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret"
    );
    const userId = decoded.userId;

    // Find the user and update the password
    const user = await authService.findUserByUserId(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and clear the reset token and expiration
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};
