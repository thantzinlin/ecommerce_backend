import mongoose from "mongoose";
import { Product } from "../models/product";

export const getAll = async (
  skip: number,
  limit: number,
  search: string = ""
): Promise<{
  data: any[];
  total: number;
  pageCounts: number;
}> => {
  const todayDateOnly = new Date().toISOString().split("T")[0];
  const query: any = { isDeleted: false };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Product.countDocuments(query);
  const pageCounts = Math.ceil(total / limit);

  const data = await Product.aggregate([
    { $match: query },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "reviews",
      },
    },
    {
      $lookup: {
        from: "discounts",
        let: { discountId: "$discountId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$discountId"] },
                  { $eq: ["$isPublic", true] },
                ],
              },
            },
          },
        ],
        as: "discount",
      },
    },

    {
      $unwind: {
        path: "$discount",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        isDiscountActive: {
          $cond: {
            if: {
              $and: [
                { $ne: ["$discount", null] },
                {
                  $lte: [
                    "$discount.startDate",
                    { $dateFromString: { dateString: todayDateOnly } },
                  ],
                },
                {
                  $gte: [
                    "$discount.endDate",
                    { $dateFromString: { dateString: todayDateOnly } },
                  ],
                },
                { $eq: ["$discount.isActive", true] },
              ],
            },
            then: true,
            else: false,
          },
        },
        averageRating: {
          $cond: {
            if: { $gt: [{ $size: "$reviews" }, 0] },
            then: { $avg: "$reviews.rating" },
            else: 0,
          },
        },
        totalReviews: { $size: "$reviews" },
        variants: {
          $cond: {
            if: { $gt: [{ $size: "$variants" }, 0] },
            then: {
              $map: {
                input: "$variants",
                as: "variant",
                in: {
                  $mergeObjects: [
                    "$$variant",
                    {
                      discountedPrice: {
                        $cond: {
                          if: { $eq: ["$isDiscountActive", false] },
                          then: "$$variant.price",
                          else: {
                            $cond: {
                              if: {
                                $eq: ["$discount.discountType", "percentage"],
                              },
                              then: {
                                $subtract: [
                                  "$$variant.price",
                                  {
                                    $multiply: [
                                      "$$variant.price",
                                      { $divide: ["$discount.value", 100] },
                                    ],
                                  },
                                ],
                              },
                              else: {
                                $cond: {
                                  if: {
                                    $eq: ["$discount.discountType", "fixed"],
                                  },
                                  then: {
                                    $subtract: [
                                      "$$variant.price",
                                      "$discount.value",
                                    ],
                                  },
                                  else: "$$variant.price",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
            else: "$variants",
          },
        },
        discountedPrice: {
          $cond: {
            if: {
              $or: [
                { $lte: [{ $size: "$variants" }, 0] },
                { $eq: ["$variants", null] },
              ],
            },
            then: {
              $cond: {
                if: { $eq: ["$isDiscountActive", false] },

                then: "$price",
                else: {
                  $cond: {
                    if: { $eq: ["$discount.discountType", "percentage"] },
                    then: {
                      $subtract: [
                        "$price",
                        {
                          $multiply: [
                            "$price",
                            { $divide: ["$discount.value", 100] },
                          ],
                        },
                      ],
                    },
                    else: {
                      $cond: {
                        if: { $eq: ["$discount.discountType", "fixed"] },
                        then: { $subtract: ["$price", "$discount.value"] },
                        else: "$price",
                      },
                    },
                  },
                },
              },
            },
            else: null,
          },
        },
      },
    },
    {
      $project: {
        name: 1,
        images: 1,
        stockQuantity: 1,
        description: 1,
        price: 1,
        discountId: 1,
        discountType: "$discount.discountType",
        discountValue: {
          $cond: {
            if: {
              $eq: ["$isDiscountActive", true],
            },
            then: "$discount.value",
            else: 0,
          },
        },

        isDiscountActive: 1,
        discountedPrice: 1,
        categoryId: 1,
        categoryName: "$category.name",
        reviews: 1,
        variants: 1,
        averageRating: 1,
        totalReviews: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]).exec();

  return {
    data,
    total,
    pageCounts,
  };
};

export const getByIdWithReview = async (
  id: string
): Promise<Product | null> => {
  const todayDateOnly = new Date().toISOString().split("T")[0];
  const productWithReviews = await Product.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "reviews",
      },
    },
    {
      $lookup: {
        from: "discounts",
        localField: "discountId",
        foreignField: "_id",
        as: "discount",
      },
    },
    {
      $addFields: {
        isDiscountActive: {
          $cond: {
            if: {
              $and: [
                { $gt: [{ $size: "$discount" }, 0] },
                {
                  $lte: [
                    { $arrayElemAt: ["$discount.startDate", 0] },
                    { $dateFromString: { dateString: todayDateOnly } },
                  ],
                },
                {
                  $gte: [
                    { $arrayElemAt: ["$discount.endDate", 0] },
                    { $dateFromString: { dateString: todayDateOnly } },
                  ],
                },
                { $eq: [{ $arrayElemAt: ["$discount.isActive", 0] }, true] },
              ],
            },
            then: true,
            else: false,
          },
        },

        averageRating: {
          $cond: {
            if: { $gt: [{ $size: "$reviews" }, 0] },
            then: { $avg: "$reviews.rating" },
            else: 0,
          },
        },
        totalReviews: { $size: "$reviews" },

        // Base product discounted price
        discountedPrice: {
          $cond: {
            if: { $eq: ["$isDiscountActive", false] },
            then: "$price",
            else: {
              $cond: {
                if: {
                  $eq: [
                    { $arrayElemAt: ["$discount.discountType", 0] },
                    "percentage",
                  ],
                },
                then: {
                  $subtract: [
                    "$price",
                    {
                      $multiply: [
                        "$price",
                        {
                          $divide: [
                            { $arrayElemAt: ["$discount.value", 0] },
                            100,
                          ],
                        },
                      ],
                    },
                  ],
                },
                else: {
                  $cond: {
                    if: {
                      $eq: [
                        { $arrayElemAt: ["$discount.discountType", 0] },
                        "fixed",
                      ],
                    },
                    then: {
                      $subtract: [
                        "$price",
                        { $arrayElemAt: ["$discount.value", 0] },
                      ],
                    },
                    else: "$price",
                  },
                },
              },
            },
          },
        },

        // Discounted price for variants
        discountedVariants: {
          $map: {
            input: "$variants",
            as: "variant",
            in: {
              $mergeObjects: [
                "$$variant",
                {
                  discountedPrice: {
                    $cond: {
                      if: { $eq: ["$isDiscountActive", false] },
                      then: "$$variant.price",

                      else: {
                        $cond: {
                          if: {
                            $eq: [
                              { $arrayElemAt: ["$discount.discountType", 0] },
                              "percentage",
                            ],
                          },
                          then: {
                            $subtract: [
                              "$$variant.price",
                              {
                                $multiply: [
                                  "$$variant.price",
                                  {
                                    $divide: [
                                      {
                                        $arrayElemAt: ["$discount.value", 0],
                                      },
                                      100,
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                          else: {
                            $cond: {
                              if: {
                                $eq: [
                                  {
                                    $arrayElemAt: ["$discount.discountType", 0],
                                  },
                                  "fixed",
                                ],
                              },
                              then: {
                                $subtract: [
                                  "$$variant.price",
                                  {
                                    $arrayElemAt: ["$discount.value", 0],
                                  },
                                ],
                              },
                              else: "$$variant.price",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        name: 1,
        images: 1,
        stockQuantity: 1,
        description: 1,
        price: 1,
        reviews: 1,
        averageRating: 1,
        totalReviews: 1,
        discountedPrice: 1,
        discountId: 1,
        isDiscountActive: 1,
        discountType: { $arrayElemAt: ["$discount.discountType", 0] },
        discountValue: {
          $cond: {
            if: { $eq: ["$isDiscountActive", true] },
            then: { $arrayElemAt: ["$discount.value", 0] },
            else: 0,
          },
        },
        variants: "$discountedVariants",
        createdAt: 1,
        updatedAt: 1,

        debug: {
          isDiscountActive: "$isDiscountActive",
          discountType: { $arrayElemAt: ["$discount.discountType", 0] },
          discountValue: { $arrayElemAt: ["$discount.value", 0] },
          startDate: { $arrayElemAt: ["$discount.startDate", 0] },
          endDate: { $arrayElemAt: ["$discount.endDate", 0] },
          currentDate: new Date(todayDateOnly),
        },
      },
    },
  ]).exec();

  return productWithReviews[0] || null;
};
// export const getByIdWithReview = async (
//   id: string
// ): Promise<Product | null> => {
//   const productWithReviews = await Product.aggregate([
//     {
//       $match: { _id: new mongoose.Types.ObjectId(id), isDeleted: false },
//     },
//     {
//       $lookup: {
//         from: "reviews",
//         localField: "_id",
//         foreignField: "productId",
//         as: "reviews",
//       },
//     },
//     {
//       $lookup: {
//         from: "discounts",
//         localField: "discountId",
//         foreignField: "_id",
//         as: "discount",
//       },
//     },
//     {
//       $addFields: {
//         isDiscountActive: {
//           $cond: {
//             if: {
//               $and: [
//                 { $ne: ["$discount", null] },
//                 { $lte: ["$discount.startDate", now] },
//                 { $gte: ["$discount.endDate", now] },
//                 { $eq: ["$discount.isActive", true] },
//               ],
//             },
//             then: true,
//             else: false,
//           },
//         },
//         averageRating: {
//           $cond: {
//             if: { $gt: [{ $size: "$reviews" }, 0] },
//             then: { $avg: "$reviews.rating" },
//             else: 0,
//           },
//         },
//         totalReviews: { $size: "$reviews" },

//         // Calculate discounted price for base product
//         discountedPrice: {
//           $cond: {
//             if: { $eq: [{ $size: "$discount" }, 0] },
//             then: "$price",
//             else: {
//               $cond: {
//                 if: {
//                   $eq: [
//                     { $arrayElemAt: ["$discount.discountType", 0] },
//                     "percentage",
//                   ],
//                 },
//                 then: {
//                   $subtract: [
//                     "$price",
//                     {
//                       $multiply: [
//                         "$price",
//                         {
//                           $divide: [
//                             { $arrayElemAt: ["$discount.value", 0] },
//                             100,
//                           ],
//                         },
//                       ],
//                     },
//                   ],
//                 },
//                 else: {
//                   $cond: {
//                     if: {
//                       $eq: [
//                         { $arrayElemAt: ["$discount.discountType", 0] },
//                         "fixed",
//                       ],
//                     },
//                     then: {
//                       $subtract: [
//                         "$price",
//                         { $arrayElemAt: ["$discount.value", 0] },
//                       ],
//                     },
//                     else: "$price",
//                   },
//                 },
//               },
//             },
//           },
//         },

//         // Calculate discounted price for each variant
//         discountedVariants: {
//           $map: {
//             input: "$variants",
//             as: "variant",
//             in: {
//               $mergeObjects: [
//                 "$$variant",
//                 {
//                   discountedPrice: {
//                     $cond: {
//                       if: { $eq: [{ $size: "$discount" }, 0] },
//                       then: "$$variant.price",
//                       else: {
//                         $cond: {
//                           if: {
//                             $eq: [
//                               { $arrayElemAt: ["$discount.discountType", 0] },
//                               "percentage",
//                             ],
//                           },
//                           then: {
//                             $subtract: [
//                               "$$variant.price",
//                               {
//                                 $multiply: [
//                                   "$$variant.price",
//                                   {
//                                     $divide: [
//                                       { $arrayElemAt: ["$discount.value", 0] },
//                                       100,
//                                     ],
//                                   },
//                                 ],
//                               },
//                             ],
//                           },
//                           else: {
//                             $cond: {
//                               if: {
//                                 $eq: [
//                                   {
//                                     $arrayElemAt: ["$discount.discountType", 0],
//                                   },
//                                   "fixed",
//                                 ],
//                               },
//                               then: {
//                                 $subtract: [
//                                   "$$variant.price",
//                                   { $arrayElemAt: ["$discount.value", 0] },
//                                 ],
//                               },
//                               else: "$$variant.price",
//                             },
//                           },
//                         },
//                       },
//                     },
//                   },
//                 },
//               ],
//             },
//           },
//         },
//       },
//     },
//     {
//       $project: {
//         name: 1,
//         images: 1,
//         stockQuantity: 1,
//         description: 1,
//         price: 1,
//         reviews: 1,
//         averageRating: 1,
//         totalReviews: 1,
//         discountedPrice: 1,
//         discountId: 1,
//         discountType: { $arrayElemAt: ["$discount.discountType", 0] },
//         discountValue: {
//           $cond: {
//             if: { $eq: [{ $size: "$discount" }, 0] },
//             then: 0,
//             else: { $arrayElemAt: ["$discount.value", 0] },
//           },
//         },
//         variants: "$discountedVariants",
//       },
//     },
//   ]).exec();

//   return productWithReviews[0] || null;
// };

export const getById = async (id: string): Promise<Product | null> => {
  return Product.findById(id).lean();
};

export const getByCategoryId = async (
  categoryId: string
): Promise<Product[]> => {
  return Product.find({ categoryId }).exec();
};

export const findByIdAndUpdate = async (
  id: string,
  data: Partial<Product>
): Promise<Product | null> => {
  return Product.findByIdAndUpdate(id, data, { new: true });
};

export const findByIdAndDelete = async (
  id: string
): Promise<Product | null> => {
  return Product.findByIdAndDelete(id);
};

export const create = async (data: any): Promise<Product> => {
  const product = new Product(data);
  return await product.save();
};

export const addVariant = async (
  productId: string,
  variantData: any
): Promise<Product | null> => {
  return await Product.findByIdAndUpdate(
    productId,
    {
      $push: { variants: variantData },
    },
    { new: true }
  );
};

export const updateVariant = async (
  productId: string,
  variantId: string,
  variantData: any
): Promise<Product | null> => {
  return await Product.findOneAndUpdate(
    {
      _id: productId,
      "variants._id": variantId,
    },
    {
      $set: {
        "variants.$": variantData,
      },
    },
    { new: true }
  );
};

export const deleteVariant = async (
  productId: string,
  variantId: string
): Promise<Product | null> => {
  return await Product.findByIdAndUpdate(
    productId,
    {
      $pull: { variants: { _id: variantId } },
    },
    { new: true }
  );
};
