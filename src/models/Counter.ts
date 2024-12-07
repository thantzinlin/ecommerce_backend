import mongoose, { Schema, Document } from "mongoose";
export interface ICounter extends Document {
  date: string;
  sequence: number;
}

const CounterSchema = new Schema<ICounter>({
  date: { type: String, required: true, unique: true },
  sequence: { type: Number, default: 0 },
});

const Counter = mongoose.model<ICounter>("Counter", CounterSchema);
export default Counter;
