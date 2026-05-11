import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema({
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
	wax: {
		type: Number,
		required: [true, "Wax count is required"],
		min: [0, "Wax count cannot be less than 0"],
		max: [2, "Wax count cannot exceed 2"],
	},
}, { timestamps: true });

const Bike = mongoose.models.Bike || mongoose.model("Bike", bikeSchema);

export default Bike;
