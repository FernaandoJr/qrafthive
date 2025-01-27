import User from "@/models/User"
import connectToDatabase from "@/lib/mongoose"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    await connectToDatabase()

    const { fullName, email, password } = await req.json()

    if (!fullName || !email || !password) {
        return NextResponse.json({ message: "Please fill all fields" }, { status: 400 })
    }

    console.log("fullName: ", fullName)
    console.log("email: ", email)
    console.log("password: ", password)

    const newUser = new User({ fullName, email, password })
    await newUser.save()
    return NextResponse.json(newUser, { status: 201 })
}
