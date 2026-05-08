import mongoose from "mongoose";

const sedanShineSchema = new mongoose.Schema({});

const SedanShine = mongoose.models.SedanShine || mongoose.model("SedanShine", sedanShineSchema);

export default SedanShine;
