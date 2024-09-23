import { Response } from "express";
import { ResponseMessages, StatusCodes } from "./constants";

export const sendResponse = (
  res: Response,
  data?: any,
  statusCode: number = StatusCodes.OK,
  message = ResponseMessages.SUCCESS
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
