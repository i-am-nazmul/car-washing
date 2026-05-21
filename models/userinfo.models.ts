import mongoose from "mongoose";

const userInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: null,
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    vehicles: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const UserInfo = mongoose.models.UserInfo || mongoose.model("UserInfo", userInfoSchema);

export default UserInfo;
