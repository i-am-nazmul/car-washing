import mongoose from "mongoose";

const customerMessageSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "Customer ID is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [5, "Message must be at least 5 characters"],
    maxlength: [1000, "Message cannot exceed 1000 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CustomerMessage = mongoose.models.CustomerMessage || mongoose.model("CustomerMessage", customerMessageSchema);

export default CustomerMessage;
