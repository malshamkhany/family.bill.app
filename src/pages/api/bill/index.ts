import createBill from "@/api/features/bill/createBill";
import getBill from "@/api/features/bill/getBill";
import listBill from "@/api/features/bill/listBills";
import nestedJsonParseToDate from "@/helpers";
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
            const newBill = nestedJsonParseToDate(req.body, [
                "createdAt",
                "billDate",
            ]);
            await createBill(newBill);
            res.status(200).json({ success: true });
        } catch (error) {
            console.log(`${error.message} when creating bill`);
            res.status(400).json({ success: false });
        }
    if (req.method === "GET") {
        const { id } = req.query;
        let result = null;
        if (id) {
            result = await getBill(id as string);
        } else {
            result = await listBill();
        }
        res.status(200).json({ success: true, data: result });
    }

    res.status(400).json({ error: "method not allowed" });
}
