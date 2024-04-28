import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function getUser(id: string) {
    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const userTable = dbContext.collection("users");
    const user = await userTable.findOne(new ObjectId(id));

    return user;
}
