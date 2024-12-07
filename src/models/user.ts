// import mongoose, { Document, Schema } from "mongoose";

// export interface Users extends Document {
//   username: string;
//   email: string;
//   password: string;
//   phone: string;
//   address: String;
//   role: string;
// }

// const userSchema: Schema = new Schema(
//   {
//     username: { type: String, required: true },
//     email: { type: String, required: false, unique: true },
//     password: { type: String, required: true },
//     phone: { type: String, required: true, unique: true },
//     address: { type: String, required: false },
//     role: { type: String },
//     isDeleted: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// userSchema.pre("find", function () {
//   this.where({ isDeleted: false });
// });

// userSchema.pre("findOne", function () {
//   this.where({ isDeleted: false });
// });

// export const Users = mongoose.model<Users>("Users", userSchema);
import mongoose, { Document, Schema } from "mongoose";

export interface Users extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  role: string;
  isDeleted: boolean;
}

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    role: { type: String, required: true },
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

export const Users = mongoose.model<Users>("Users", userSchema);
