import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(400).json({ error: "method not allowed" });
    }

    const cookie = serialize("session", null, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });

    res.setHeader("Set-Cookie", cookie);

    res.status(200).json({ success: true });
}
