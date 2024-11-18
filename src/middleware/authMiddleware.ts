import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Users } from "../models/user";
import { Token } from "../utils/tokenInterface";
import token from "../utils/token";
import HttpException from "../utils/httpException";
import { Socket } from "socket.io";

async function isAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return next(new HttpException(401, "Unauthorised"));
  }

  const accessToken = bearer.split("Bearer ")[1].trim();
  try {
    const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
      accessToken
    );

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, "Unauthorised"));
    }

    const user = await Users.findById(payload.id).select("-password").exec();

    if (!user) {
      return next(new HttpException(401, "Unauthorised"));
    }

    // (req as any).user = user;
    req.body.userId = user._id;

    //req.user = user;

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new HttpException(401, "Token expired"));
    }

    if (error instanceof JsonWebTokenError) {
      return next(new HttpException(401, "Invalid token"));
    }

    return next(new HttpException(500, "Internal server error"));

    // return next(new HttpException(401, "Unauthorised"));
  }
}

export default isAuth;

export const isAuthSocket = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.auth.token; // Token from client during connection

    if (!token) {
      return next(new Error("Unauthorized: No token provided"));
    }
    const payload = await token.verifyToken(token);

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new Error("Unauthorized: Invalid token"));
    }
    const user = await Users.findById(payload.id).select("-password").exec();

    if (!user) {
      return next(new Error("Unauthorized: User not found"));
    }

    // Attach user data to the socket for later use
    socket.data.user = user;
    next(); // Proceed to the next middleware or event handler
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new Error("Unauthorized: Token expired"));
    }
    if (error instanceof JsonWebTokenError) {
      return next(new Error("Unauthorized: Invalid token"));
    }
    next(new Error("Internal server error"));
  }
};
