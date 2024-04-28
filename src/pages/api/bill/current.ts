import getCurrentBill from "@/api/features/bill/getCurrentBill";
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
    if (req.method === "GET") {
        const bill = await getCurrentBill();
        res.status(200).json({ success: true, data: bill });
    }

    res.status(400).json({ error: "method not allowed" });
}
