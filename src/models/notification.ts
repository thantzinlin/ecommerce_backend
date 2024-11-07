import mongoose, { Schema, Document } from "mongoose";

export interface Notification extends Document {
  userId: string;
  message: string;
  isRead: boolean;
}

const NotificationSchema = new Schema<Notification>({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
});

export const Notification = mongoose.model<Notification>(
  "Notification",
  NotificationSchema
);
