import { serialize } from "cookie";
import * as jose from "jose";
import type { NextApiRequest, NextApiResponse } from "next";
import getUserByUserName from "@/api/features/user/getUserByUserName";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(400).json({ error: "method not allowed" });
    }

    const { userName, password } = req.body;

    const user = await getUserByUserName(userName);

    if (!user?._id || password !== process.env.USER_PASSWORD) {
        res.status(400).json({
            success: false,
            error: "wrong username or password",
        });
    }

    const jwtToken = await new jose.SignJWT({
        userId: user._id,
        userName: user.userName,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const cookie = serialize("session", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });
    res.setHeader("Set-Cookie", cookie);
    res.status(200).json({ success: true, user });
}
