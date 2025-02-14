import { NextFunction, Request, Response } from "express";
import * as notiService from "../services/notiService";
import { sendResponse } from "../utils/responses";
import { ResponseMessages, StatusCodes } from "../utils/constants";
import axios from "axios";

export const getUnreadCount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await notiService.getUnreadCount();

    return sendResponse(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getAllNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const type = (req.query.type as string) || "order";

    const { data, total } = await notiService.getAllNotification(type);

    return sendResponse(
      res,
      data,
      StatusCodes.OK,
      ResponseMessages.SUCCESS,
      total
    );
  } catch (error) {
    return next(error);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { from, text, to } = req.body;

    const requestData = {
      from: from,
      text: text.replace("{otp}", "1234"),
      to: to,
    };
    const response = await axios.post(
      "https://boomsms.net/api/sms/json",
      requestData,
      {
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImNhZDBkMDZjZWUxNmQ5NmQxNmM1OWRmMzkwYTQyN2NjYzExZDQ3OTU3YmNjODhmOWMzYzdlZTcyYmViNDNjNjZhYjk1MjE5NTgyMGJiMDcxIn0.eyJhdWQiOiIzIiwianRpIjoiY2FkMGQwNmNlZTE2ZDk2ZDE2YzU5ZGYzOTBhNDI3Y2NjMTFkNDc5NTdiY2M4OGY5YzNjN2VlNzJiZWI0M2M2NmFiOTUyMTk1ODIwYmIwNzEiLCJpYXQiOjE3MjgzNjMzNDUsIm5iZiI6MTcyODM2MzM0NSwiZXhwIjoxNzU5ODk5MzQ1LCJzdWIiOiIxNDA1Iiwic2NvcGVzIjpbXX0.xUPb5LtTRqQY_XTFHNo8MFjg_wZ8kHFX5Sev_uo3NHYNkyrvcI71h9GJ3Z_8vctzNIZVpPIU4sNzT3PMMWNgxwNl_0jxTacLOSMXyuguE8TfMb6RGQc8VHVBeGNSKBWnFAxdSQCc0d6inawHUnPAZVNU1hAD6CTHmDlPunTdhIZE1qESnQNCM1PjVNekGVUbLph92cUO-VzvZf7khxyIz5SAyc3kYu5SyeGOWq9P0LlyI3Dw2zyQH6BeunJxEvCPI8QKBIL-YNce46cu1Jjb6nJaTfS_EzVIPvDrcjArbQt6Nirhcguzra5B7wMhfsIn5zTYF0v7Zw44rRWd76QkN41-ifV7W2oyCe9PTAFg1lCjsAAHAgBzXVj6byhwVWf_jWzOBjMQscymUgXKZ1EptjLHH6tvvEeUNLoC1dQAqN1V4xOTHbDDHUKLslkPYI6Q5hm21SEvEZ0FDrEyKjQ7uDl-soBWeaoZl_ysxv9hfpNOS5va6kKAktWtCK8OwqT0cMC0ubViaT8gXVAEI5IhywN9BXu0P_bOyCbAs-YW2Uf38TEfjhXIDZ64ZjnfYPPOb11qMlTxYJuqeJHFfI3_6FZV4f4KJ3NbMLVCrwxqjHYCPmuql-t44e1q1l89wqFwSMK55K-Q6-b_rt4seo8b8CAew96-BKAQoGey2vj75wA`,
        },
      }
    );

    return sendResponse(
      res,
      response.data,
      StatusCodes.OK,
      ResponseMessages.SUCCESS
    );
  } catch (error) {
    return next(error);
  }
};
