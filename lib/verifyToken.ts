import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const verifyToken = async (req: Request) => {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
    } catch (err) {
        return NextResponse.redirect("/login");
    }

    return null;
};
