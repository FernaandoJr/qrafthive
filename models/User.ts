import mongoose, { Document, Model, Schema } from "mongoose"

interface User extends Document {
    fullName: string
    email: string
    password: string
    role: "user" | "admin"
    createdAt?: Date
    updatedAt?: Date
}

const UserSchema: Schema<User> = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
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
    // Verifica o token
    const tokenVerificationResponse = await verifyToken(req);
    if (tokenVerificationResponse) {
        return tokenVerificationResponse; // Se o token for inválido, retorna o erro
    }

    // Se o token for válido, prossiga com a lógica da rota
    return NextResponse.json({ message: 'Usuário autenticado com sucesso!' });
}


export default User
