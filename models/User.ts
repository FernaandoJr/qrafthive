import mongoose, { Document, Model, Schema } from "mongoose"

interface User extends Document {
    fullName: string
    email: string
    password: string
}

const UserSchema: Schema<User> = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { versionKey: false },
)

const User: Model<User> = mongoose.models.User || mongoose.model<User>("User", UserSchema)

export default User
