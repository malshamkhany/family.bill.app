import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { cookies } from "next/headers";
import getUser from "./api/features/user/getUser";

// 1. Specify protected and public routes
const protectedRoutes = ["/", "/add", "history"];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    // 3. Decrypt the session from the cookie
    const cookie = cookies().get("session")?.value;

    if (!cookie || cookie === "null") {
        if (!isPublicRoute) {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        } else {
            return NextResponse.next();
        }
    }

    let userId = null;
    try {
        const { payload }: any = await jose.jwtVerify(
            cookie,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );
        userId = payload?.userId;
    } catch (error) {
        // await middleware_logoutUser();
    }

    if (userId) {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/user`
            );
            const result = await response.json();
            if (!result.success) {
                // await middleware_logoutUser();
                return NextResponse.redirect(new URL("/login", req.nextUrl));
            }
        } catch (error) {
            // await middleware_logoutUser();
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    }

    // 5. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !userId) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // 6. Redirect to / if the user is authenticated
    if (isPublicRoute && userId) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
}

// const middleware_logoutUser = async () => {
//     await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/logout`, {
//         method: "POST",
//     });
// };

// Routes Middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.ico$).*)", "/login"],
};
