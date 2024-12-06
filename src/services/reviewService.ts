import { Review } from "../models/review";

export const getAll = async (
  skip: number,
  limit: number,
  search: string = ""
): Promise<{
  data: Review[];
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
  const total = await Review.countDocuments(query);
  const pageCounts = Math.ceil(total / limit);
  const data = await Review.find(query).skip(skip).limit(limit).exec();

  return {
    data,
    total,
    pageCounts,
  };
};

export const getById = async (id: string): Promise<Review | null> => {
  return Review.findById(id);
};

export const findByIdAndUpdate = async (
  id: string,
  data: Partial<Review>
): Promise<Review | null> => {
  return Review.findByIdAndUpdate(id, data, { new: true });
};

export const findByIdAndDelete = async (id: string): Promise<Review | null> => {
  return Review.findByIdAndDelete(id);
};

export const create = async (data: Review): Promise<Review> => {
  const review = new Review(data);
  return review.save();
};

export const getReviewsByUserId = async (userId: string): Promise<any[]> => {
  const reviews = await Review.find({ userId })
    .select("comment rating productId")
    .populate({
      path: "productId",
      select: "name images",
    })
    .exec();

  if (!reviews || reviews.length === 0) return [];

  return reviews.map((review: any) => ({
    rating: review.rating,
    comment: review.comment,
    productName: review.productId?.name,
    productImages: review.productId?.images[0] || [],
  }));
};
