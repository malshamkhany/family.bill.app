import getContributor from "@/api/features/billContribution/getContributor";
import updateContributor from "@/api/features/billContribution/updateContributor";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    success?: boolean;
    error?: string;
    data?: any;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Partial<Data>>
) {
    if (req.method !== "POST"){
        return res.status(400).json({ success: false, error: "method not allowed" });
    }
    
    
    const ids = req.body;
    let result = [];
    if (ids) {
        try {
            if(!Array.isArray(ids)) 
                throw new Error("invalid object")

            for (const id of ids){
                const contributor = await getContributor(id)
                result.push(contributor)
            }
        } catch (error) {
            return res.status(400).json({ success: false, error: `contributor bill not found: ${error.message}` });
        }
    } else {
        return res.status(400).json({ error: "paramater {ids} in url is missing" });
    }
    return res.status(200).json({ success: true, data: result });
}
