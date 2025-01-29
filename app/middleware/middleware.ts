import { NextResponse } from "next/server";
import { verifyToken } from "../../lib/verifyToken";

export async function middleware(req: Request) {
    const tokenVerificationResponse = await verifyToken(req);

    if (tokenVerificationResponse) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.headers.set("x-auth-error", "You are not authenticated. Please log in.");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/qrcode', '/api/users'],
};
