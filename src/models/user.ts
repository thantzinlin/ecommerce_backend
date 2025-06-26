import mongoose, { Document, Schema } from "mongoose";
import { Township } from "./township";

export interface IUsers extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  address: {
    city: string;
    township: string;
    street: string;
    postalCode: number;
  };
  role: string;
  isRegistered: boolean;
  isDeleted: boolean;
}

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    phone: { type: String, required: true, unique: true },
    address: {
      street: { type: String, required: false },
      city: { type: String, required: false },
      township: { type: String, required: false },
      postalCode: { type: String, required: false },
    },
    role: { type: String, required: false },
    isRegistered: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Middleware to filter out deleted users in queries
userSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

userSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

export const Users = mongoose.model<IUsers>("Users", userSchema);
