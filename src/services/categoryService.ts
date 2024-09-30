import { Category } from "../models/category";

export const getAll = async (
  skip: number,
  limit: number,
  search: string = ""
): Promise<{
  data: Category[];
  total: number;
  pageCounts: number;
}> => {
  const query: any = { isDeleted: false };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  const total = await Category.countDocuments(query);
  const pageCounts = Math.ceil(total / limit);
  const data = await Category.find(query).skip(skip).limit(limit).exec();

  return {
    data,
    total,
    pageCounts,
  };
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
