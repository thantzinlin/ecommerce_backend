import { Category } from "../models/category";

export const getAll = async (): Promise<Category[]> => {
  return Category.find();
};

export const getById = async (id: string): Promise<Category | null> => {
  return Category.findById(id);
};

export const findByIdAndUpdate = async (
  id: string,
  data: Partial<Category>
): Promise<Category | null> => {
  return Category.findByIdAndUpdate(id, data, { new: true });
};

export const findByIdAndDelete = async (
  id: string
): Promise<Category | null> => {
  return Category.findByIdAndDelete(id);
};

export const create = async (data: Category): Promise<Category> => {
  const category = new Category(data);
  return category.save();
};
