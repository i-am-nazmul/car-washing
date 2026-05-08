import mongoose from "mongoose";

const customerMessageSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "Customer ID is required"],
  },
  customerEmail: {
    type: String,
    required: [true, "Customer email is required"],
    lowercase: true,
    trim: true,
  },
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [5, "Message must be at least 5 characters"],
    maxlength: [1000, "Message cannot exceed 1000 characters"],
  },
  status: {
    type: String,
    enum: ["new", "read", "replied"],
    default: "new",
  },
  reply: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

const CustomerMessage = mongoose.models.CustomerMessage || mongoose.model("CustomerMessage", customerMessageSchema);

export default CustomerMessage;
