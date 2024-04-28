import updateBillExpenses from "@/api/features/bill/updateBillExpenses";
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
    if (req.method === "PATCH") {
        try {
            const bill = await updateBillExpenses(
                req.body.id,
                nestedJsonParseToDate(req.body.expenses, ["createdAt"])
            );
            res.status(200).json({ success: true, data: bill });
        } catch (error) {
            console.log(`${error.message} when updating bill`);
            res.status(400).json({ success: false });
        }
    }

    res.status(400).json({ error: "method not allowed" });
}
