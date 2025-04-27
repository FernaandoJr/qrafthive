import User from "@/models/User"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
        return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 })
    }

    try {
        // Fetch user from the database using the provided ID
        const user = await User.findById(id).select("-password")
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 })
        }
        return new Response(JSON.stringify(user), { status: 200 })
    } catch (error) {
        console.error("Error fetching user:", error)
        return new Response(JSON.stringify({ message: "Error fetching user" }), { status: 500 })
    }
}
