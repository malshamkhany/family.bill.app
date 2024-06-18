import addContibutor from "@/api/features/billContribution/addContibutor";
import removeContributor from "@/api/features/billContribution/removeContributor";
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
    return res.status(400).json({ error: "endpoint under work" });

    // if (req.method === "PATCH") {
    //     const { mode } = req.query;

    //     if (mode !== "add" && mode !== "remove") {
    //         res.status(400).json({
    //             success: false,
    //             error: "mode unknown. Mode can only be 'add' or 'remove'",
    //         });
    //     }

    //     try {
    //         const bill =
    //             mode === "add"
    //                 ? await addContibutor(req.body.userId, req.body.userId)
    //                 : removeContributor(req.body.userId, req.body.userId);

    //         res.status(200).json({ success: true, data: bill });
    //     } catch (error) {
    //         console.log(`${error.message} when updating bill`);
    //         res.status(400).json({ success: false });
    //     }
    // }

    // res.status(400).json({ error: "method not allowed" });
}
