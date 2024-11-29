import mongoose, { Schema, Document, Types } from "mongoose";

export interface Category extends Document {
  name: string;
  slug: string;
  image?: string;
  parentCategory?: Types.ObjectId;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    isDeleted: { type: Boolean, default: false },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CategorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentCategory",
});

export const Category = mongoose.model<Category>("Category", CategorySchema);
