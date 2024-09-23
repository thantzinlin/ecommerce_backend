import { Response } from "express";
import { ResponseMessages, StatusCodes } from "./constants";

export const sendResponse = (
  res: Response,
  statusCode: number = StatusCodes.OK,
  data?: any,
  message = ""
): void => {
  const isSuccess = statusCode >= 200 && statusCode < 300;
  const responseMessage =
    message ||
    (isSuccess ? ResponseMessages.SUCCESS : ResponseMessages.FAILURE);

  res.status(statusCode).json({
    returncode: isSuccess ? `${StatusCodes.OK}` : `${statusCode}`,
    returnmessage: responseMessage,
    data,
  });
};
