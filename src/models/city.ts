import mongoose, { Schema, Document } from "mongoose";

export interface ICity extends Document {
  name: string;
  isDeleted: boolean;
}

const CitySchema = new Schema<ICity>(
  {
    name: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const City = mongoose.model<ICity>("City", CitySchema);
