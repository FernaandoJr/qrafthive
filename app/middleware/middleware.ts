import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Rotas que não precisam de verificação de birthDate
    const publicRoutes = ['/login', '/register', '/complete-profile', '/api/auth'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Verificar se o usuário está autenticado
    const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.headers.set("x-auth-error", "You are not authenticated. Please log in.");
        return response;
    }

    // Verificar se o usuário tem birthDate preenchido
    const hasBirthDate = token.birthDate;
    
    // Se não tem birthDate e não está na página de completar perfil, redirecionar
    if (!hasBirthDate && pathname !== '/complete-profile') {
        return NextResponse.redirect(new URL("/complete-profile", request.url));
    }

    // Se tem birthDate e está tentando acessar complete-profile, redirecionar para home
    if (hasBirthDate && pathname === '/complete-profile') {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};
