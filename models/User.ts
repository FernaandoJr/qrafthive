import mongoose, { Document, Model, Schema } from "mongoose"

interface User extends Document {
    fullName: string
    email: string
    password: string
    role: "user" | "admin"
    createdAt?: Date
    updatedAt?: Date
}

const UserSchema: Schema<User> = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, unique: true },
        password: { type: String },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
)

const User: Model<User> = mongoose.models.User || mongoose.model<User>("User", UserSchema)


import { NextResponse } from 'next/server'
import { verifyToken } from '../lib/verifyToken'

export async function handler(req: Request) {

    const tokenVerificationResponse = await verifyToken(req);
    if (tokenVerificationResponse) {
        return tokenVerificationResponse;
    }

    return NextResponse.json({ message: 'Usuário autenticado com sucesso!' });
}


export default User
