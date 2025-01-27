import mongoose from "mongoose"

const connectDB = async () => {
    if (mongoose.connection.readyState) {
        return true
    }

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI not found")
        return false
    }

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected")
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

export default connectDB
