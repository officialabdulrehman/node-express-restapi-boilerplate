import mongoose from "mongoose";
import { Roles } from "../../dto/user/Roles";

const { Schema, model } = mongoose;

const schemaFields = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: false },
  dateOfBirth: { type: Date, required: false },
  phoneNumber: { type: String, required: false, unique: true },
  role: {
    type: String,
    default: Roles.USER,
    enum: Object.values(Roles),
    required: true,
  },
};

const schema = new Schema(schemaFields, { timestamps: true });

export const UserModel = model("User", schema);
