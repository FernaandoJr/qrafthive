import User from "@/models/User"
import connectToDatabase from "@/lib/mongoose"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    await connectToDatabase()

    const { fullName, email, password } = await req.json()

    if (!fullName || !email || !password) {
        return NextResponse.json({ message: "Please fill all fields" }, { status: 400 })
    }

    const newUser = new User({ fullName, email, password })
    await newUser.save()
    return NextResponse.json(newUser, { status: 201 })
}

export async function GET() {
    await connectToDatabase();

    try {
        const users = await User.find();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
    }
}