import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
}

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

userSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

export const User = mongoose.model<User>("User", userSchema);
