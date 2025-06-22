import mongoose from "mongoose"

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return true
    }

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI not found")
        return false
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
        })
        console.log("MongoDB Connected")
        return true
    } catch (err) {
        console.error("MongoDB connection error:", err)
        return false
    }
}

export default connectDB
