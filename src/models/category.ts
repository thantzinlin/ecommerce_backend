import mongoose, { Schema, Document } from "mongoose";

export interface Category extends Document {
  name: string;
  description?: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

export const Category = mongoose.model<Category>("Category", CategorySchema);
