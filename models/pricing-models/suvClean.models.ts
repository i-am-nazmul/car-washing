import mongoose from "mongoose";

const suvCleanSchema = new mongoose.Schema({});

const SuvClean = mongoose.models.SuvClean || mongoose.model("SuvClean", suvCleanSchema);

export default SuvClean;
