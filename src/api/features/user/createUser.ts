import { User, validate } from "@/api/models/user";
import clientPromise from "@/lib/mongodb";

export default async function createUser(user: User) {
    const validationResult = validate(user);

    if (validationResult.success === false) {
        return validationResult.error.issues;
    }

    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const users = dbContext.collection("users");
    const result = await users.insertOne(user);

    return result;
}
