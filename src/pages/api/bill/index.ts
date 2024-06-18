import createBill from "@/api/features/bill/createBill";
import getBill from "@/api/features/bill/getBill";
import listBill from "@/api/features/bill/listBills";
import updateBill from "@/api/features/bill/updateBill";
import { nestedJsonParseToDate } from "@/helpers";
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
            await createBill({...newBill, createdAt: new Date()});
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

    if(req.method === "PATCH") {
        const billToUpdate = nestedJsonParseToDate(req.body, [
            "createdAt",
            "billDate",
        ]);
        const save = await updateBill(billToUpdate);
        res.status(200).json({ success: true, data: save });
    }

    res.status(400).json({ error: "method not allowed" });
}
