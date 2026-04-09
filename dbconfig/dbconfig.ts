import mongoose from "mongoose";

const connect = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("MongoDB is already connected.");
            return;
        }

        mongoose.connection.on('connected', () => {
            console.log("MongoDB connected successfully!");
        });

        mongoose.connection.on('error', (err) => {
            console.error("MongoDB connection error:", err);
            process.exit();
            
        });

        await mongoose.connect(process.env.MONGODB_URI!);

    } catch (error) {
        console.error("Something went wrong with the database connection!");
        console.error(error);

    }
};

export { connect };