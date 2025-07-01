import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://omery020040:PxCByj3t2cfS1Bz6@cluster0.jopapso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

export default connectDB; 