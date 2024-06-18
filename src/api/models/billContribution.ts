import { z } from "zod";

const billContributionSchema = z.object({
    _id: z.string().optional(),
    billId: z.string(),
    userId: z.string(),
    userName: z.string(),
    lastUpdated: z.date().optional(),
    transfers: z
        .array(
            z.object({
                from: z.string(),
                to: z.string(),
                amount: z.number().min(0),
                transferDate: z.string(),
            })
        )
        .optional(),
});

// extract the inferred type
export type BillContribution = z.infer<typeof billContributionSchema>;

export const validate = (data: BillContribution) =>
    billContributionSchema.safeParse(data);
