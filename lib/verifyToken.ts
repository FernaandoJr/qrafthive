import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedToken {
    userId: string;
    role: string;
}

export const verifyToken = async (req: Request) => {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        (req as Request & { user?: DecodedToken }).user = decoded;
    } catch {
        return NextResponse.redirect("/login");
    }

    return null;
};
