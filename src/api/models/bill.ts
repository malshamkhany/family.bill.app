import { z } from "zod";

const BillSchema = z.object({
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
                    id: z.string(),
                    userName: z.string(),
                    hasSettled: z.boolean(),
                    settlementDate: z.string().optional(),
                })
                .optional()
        )
        .optional(),
    status: z.string(),
    totalAmount: z.number().positive().optional(),
    createdAt: z.date(),
});

// extract the inferred type
export type Bill = z.infer<typeof BillSchema>;

export const validate = (data: Bill) => BillSchema.safeParse(data);
