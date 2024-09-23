import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { Token } from "../utils/tokenInterface";
import token from "../utils/token";
import HttpException from "../utils/httpException";

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

    const user = await User.findById(payload.id).select("-password").exec();

    if (!user) {
      return next(new HttpException(401, "Unauthorised"));
    }

    //req.user = user;

    return next();
  } catch (error) {
    return next(new HttpException(401, "Unauthorised"));
  }
}

export default isAuth;
