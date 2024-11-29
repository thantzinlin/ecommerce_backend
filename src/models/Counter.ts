import mongoose, { Schema, Document } from "mongoose";
interface Counter extends Document {
  date: string;
  sequence: number;
}

const CounterSchema = new Schema<Counter>({
  date: { type: String, required: true, unique: true },
  sequence: { type: Number, default: 0 },
});

const Counter = mongoose.model<Counter>("Counter", CounterSchema);
export default Counter;
