import { z } from "zod";

const BillSchema = z.object({
    _id: z.string().optional(),
    title: z.string(),
    billDate: z.date(),
    expenses: z.array(
        z.object({
            label: z.string(),
            amount: z.number().positive(),
            paidBy: z.string().nullable().optional(),
            createdAt: z.date(),
        })
    ),
    contributors: z
        .array(
            z
                .object({
                    billContributionId: z.string(),
                    userId: z.string(),
                    userName: z.string(),
                })
                .optional()
        )
        .optional(),
    status: z.string(),
    // settlementDate: z.string().optional(),
    totalAmount: z.number().positive().optional(),
    lastUpdated: z.date().optional(),
    createdAt: z.date(),
});

// extract the inferred type
export type Bill = z.infer<typeof BillSchema>;

export const validate = (data: Bill) => BillSchema.safeParse(data);
