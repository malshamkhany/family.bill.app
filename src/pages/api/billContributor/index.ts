import getContributor from "@/api/features/billContribution/getContributor";
import updateContributor from "@/api/features/billContribution/updateContributor";
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
            const result = await updateContributor(req.body);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            console.log(`${error.message} when updating contributor bill`);
            res.status(400).json({ success: false });
        }
    }

    if (req.method === "GET") {
        const { id } = req.query;
        let result = null;
        if (id) {
            try {
                result = await getContributor(id as string);
            } catch (error) {
                res.status(400).json({ success: false, error: "contributor bill not found" });
            }
        } else {
            res.status(400).json({ error: "paramater {id} in url is missing" });
        }
        return res.status(200).json({ success: true, data: result });
    }

    return res.status(400).json({ success: false, error: "method not allowed" });
}
