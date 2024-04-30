// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createUser from "@/api/features/user/createUser";
import getUser from "@/api/features/user/getUser";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    success: boolean;
    error: string;
    data: any;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Partial<Data>>
) {
    if (req.method === "POST")
        try {
            await createUser(req.body);
            res.status(200).json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(200).json({ success: false });
        }
    if (req.method === "GET") {
        const { id } = req.body;

        try {
            const user = await getUser(id);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            res.status(400).json({ success: false, data: "bad input" });
        }
    }

    res.status(400).json({ error: "method not allowed" });
}
