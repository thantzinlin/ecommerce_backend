import { Request, Response, NextFunction } from "express";
import HttpException from "../utils/httpException";
import logger from "../utils/logger";
import { ResponseMessages, StatusCodes } from "../utils/constants";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(`Error: ${error.message}`, { stack: error.stack });
  // const returncode = error.status || 500;
  // const returnmessage = error.message || "Something went wrong";
  const returncode = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const returnmessage = error.message || ResponseMessages.SERVER_ERROR;
  res.status(returncode).send({
    returncode,
    returnmessage,
  });
}

export default errorMiddleware;
