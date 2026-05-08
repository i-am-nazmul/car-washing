import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema({});

const Bike = mongoose.models.Bike || mongoose.model("Bike", bikeSchema);

export default Bike;
