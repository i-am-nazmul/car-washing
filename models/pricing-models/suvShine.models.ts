import mongoose from "mongoose";

const suvShineSchema = new mongoose.Schema({});

const SuvShine = mongoose.models.SuvShine || mongoose.model("SuvShine", suvShineSchema);

export default SuvShine;
