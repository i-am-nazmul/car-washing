import mongoose from "mongoose";

const sedanCleanSchema = new mongoose.Schema({});

const SedanClean = mongoose.models.SedanClean || mongoose.model("SedanClean", sedanCleanSchema);

export default SedanClean;
