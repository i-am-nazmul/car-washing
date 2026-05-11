import mongoose from "mongoose";

const sedanCleanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User ID is required"],
  },
  wash: {
    type: Number,
    required: [true, "Wash count is required"],
    min: [0, "Wash count cannot be less than 0"],
    max: [20, "Wash count cannot exceed 20"],
  },
  interiorClean: {
    type: Number,
    required: [true, "Interior clean count is required"],
    min: [0, "Interior clean cannot be less than 0"],
    max: [2, "Interior clean cannot exceed 2"],
  },
  dashboard: {
    type: Number,
    required: [true, "Dashboard count is required"],
    min: [0, "Dashboard cannot be less than 0"],
    max: [2, "Dashboard cannot exceed 2"],
  },
  tyrePolish: {
    type: Number,
    required: [true, "Tyre polish count is required"],
    min: [0, "Tyre polish cannot be less than 0"],
    max: [2, "Tyre polish cannot exceed 2"],
  },
}, { timestamps: true });

const SedanClean = mongoose.models.SedanClean || mongoose.model("SedanClean", sedanCleanSchema);

export default SedanClean;

