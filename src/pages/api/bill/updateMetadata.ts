import updateBillMetadata from "@/api/features/bill/updateBillMetadata";
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
        const metadata = {
            title: req.body.title,
            billDate: req.body.billDate,
            status: req.body.status,
        };
        try {
            const bill = await updateBillMetadata(
                req.body.id,
                nestedJsonParseToDate(metadata, ["billDate"])
            );
            res.status(200).json({ success: true, data: bill });
        } catch (error) {
            console.log(`${error.message} when updating bill`);
            res.status(400).json({ success: false });
        }
    }

    res.status(400).json({ error: "method not allowed" });
}
