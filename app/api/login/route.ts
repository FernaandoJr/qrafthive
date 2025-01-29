import User from "@/models/User";
import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import argon2 from "argon2"; 

export async function POST(req: Request) {
    await connectToDatabase();

    try {
        const { email, password } = await req.json();
        console.log({ email, password });

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        console.log("Stored password hash:", user.password);

        const isMatch = await argon2.verify(user.password, password);
        console.log("Password match:", isMatch);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        return NextResponse.json({ id: user._id, token }, { status: 200 });
    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
