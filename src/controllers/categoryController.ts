import { NextFunction, Request, Response } from "express";
import * as categoryService from "../services/categoryService";

export const getALL = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryService.getAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await categoryService.getById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Data not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    return next(error);
  }
};

export const findByIdAndUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await categoryService.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!category) {
      res.status(404).json({ message: "Data not found" });
    } else {
      res.status(200).json(category);
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating Category" });
  }
};

export const findByIdAndDelete = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await categoryService.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Data not found" });
    } else {
      res.status(200).json({ message: "Category deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting Category" });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await categoryService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error creating user" });
  }
};
