import mongoose, { Schema, Document } from "mongoose";

export interface Category extends Document {
  name: string;
  description?: string;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CategorySchema.pre("find", function () {
  this.where({ isDeleted: false });
});

CategorySchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

export const Category = mongoose.model<Category>("Category", CategorySchema);
