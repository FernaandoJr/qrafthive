import User from "@/models/User"
import connectToDatabase from "@/lib/mongoose"
import { NextResponse } from "next/server"
import { getSession } from "next-auth/react"

export async function GET() {
    await connectToDatabase()

    const session = await getSession()

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const email = session.user.email

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }
        return NextResponse.json(user, { status: 200 })
    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json({ message: "Error fetching user" }, { status: 500 })
    }
}
