import mongoose from "mongoose";

const customerMessageSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "Customer ID is required"],
  },
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true,
  },
  customerEmail: {
    type: String,
    required: [true, "Customer email is required"],
    trim: true,
    lowercase: true,
  },
  customerPhone: {
    type: String,
    required: [true, "Customer phone is required"],
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [5, "Message must be at least 5 characters"],
    maxlength: [1000, "Message cannot exceed 1000 characters"],
  },
  
});

const CustomerMessage = mongoose.models.CustomerMessage || mongoose.model("CustomerMessage", customerMessageSchema);

export default CustomerMessage;
