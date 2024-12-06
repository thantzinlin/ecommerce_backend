import mongoose, { Schema, Document } from "mongoose";

export interface ITownship extends Document {
  name: string;
  cityId: mongoose.Types.ObjectId;
  isDeleted: boolean;
}

const TownshipSchema = new Schema<ITownship>(
  {
    name: { type: String, required: true },
    cityId: { type: Schema.Types.ObjectId, ref: "City", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Township = mongoose.model<ITownship>("Township", TownshipSchema);
