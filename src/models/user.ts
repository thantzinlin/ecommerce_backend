import mongoose, { Document, Schema } from "mongoose";

export interface Users extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  address: String;
  role: string;
}

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
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

export const Users = mongoose.model<Users>("Users", userSchema);
