import { NextFunction, Request, Response } from "express";
import * as productService from "../services/productService";
import { sendResponse } from "../utils/responses";
import { ResponseMessages, StatusCodes } from "../utils/constants";
import cloudinary from "../config/cloudinaryConfig";
import logger from "../utils/logger";

export const getALL = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;
    const search = (req.query.search as string) || "";
    const skip = (page - 1) * perPage;

    const { data, total, pageCounts } = await productService.getAll(
      skip,
      perPage,
      search
    );

    sendResponse(
      res,
      data,
      StatusCodes.OK,
      ResponseMessages.SUCCESS,
      total,
      pageCounts
    );
  } catch (error) {
    return next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await productService.getById(req.params.id);
    if (!data) {
      sendResponse(res, {}, StatusCodes.NOT_FOUND, ResponseMessages.NOT_FOUND);
    } else {
      sendResponse(res, data);
    }
  } catch (error) {
    return next(error);
  }
};

export const findByIdAndUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await productService.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!data) {
      sendResponse(res, {}, StatusCodes.NOT_FOUND, ResponseMessages.NOT_FOUND);
    } else {
      sendResponse(res);
    }
  } catch (error) {
    return next(error);
  }
};

export const findByIdAndDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await productService.findByIdAndDelete(req.params.id);
    if (!data) {
      sendResponse(res, {}, StatusCodes.NOT_FOUND, ResponseMessages.NOT_FOUND);
    } else {
      sendResponse(res);
    }
  } catch (error) {
    return next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // if (!req.file) {
    //   throw new Error("File is required");
    // }

    //const result = await cloudinary.uploader.upload(req.file.path);

    // const b64 = Buffer.from(req.file.buffer).toString("base64");
    // let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    // logger.info(`base64 image : ${dataURI}`, "");

    const { images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("At least one image is required");
    }

    const uploadPromises = images.map((base64Image: string) =>
      cloudinary.uploader.upload(base64Image)
    );

    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map((result) => result.secure_url);
    console.log("Uploaded images:", imageUrls);

    const productData = {
      ...req.body,
      images: imageUrls, // Store all image URLs in the product data
    };

    const product = await productService.create(productData);
    sendResponse(res, product, StatusCodes.CREATED);
  } catch (error) {
    console.error("Image upload error:", error);
    next(error);
  }
};
