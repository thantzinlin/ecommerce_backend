import mongoose, { Schema, Document } from "mongoose";

interface Booking extends Document {
  userId: string;
  classId: string;
  seatsBooked: number;
  createdAt: Date;
}

const bookingSchema: Schema = new Schema({
  userId: { type: String, required: true },
  classId: { type: String, required: true },
  seatsBooked: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.model<Booking>("Booking", bookingSchema);
