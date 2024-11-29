import mongoose, { Schema, Document } from "mongoose";

export interface Notification extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const Notification = mongoose.model<Notification>(
  "Notification",
  NotificationSchema
);
