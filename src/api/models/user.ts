import { z } from "zod";

const UserSchema = z.object({
    userName: z.string(),
    createdAt: z.date(),
});

// extract the inferred type
export type User = z.infer<typeof UserSchema>;

export const validate = (data: User) => UserSchema.safeParse(data);