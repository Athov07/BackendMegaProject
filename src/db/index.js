import mongoose from "mongoose";
import {BD_NAME} from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${BD_NAME}`);
        console.log(`\n MongoDB connected: ${connectionInstance.connection.host} `);
    } catch (error) {
        console.error("MongoDB connection Failed:", error);
        process.exit(1);
    }
};

export default connectDB;