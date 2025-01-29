import User from "@/models/User";
import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
import argon2 from "argon2";

export async function POST(req: Request) {
    await connectToDatabase();

    try {
        const { fullName, email, password } = await req.json();

        if (!fullName || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await argon2.hash(password);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error during registration:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
