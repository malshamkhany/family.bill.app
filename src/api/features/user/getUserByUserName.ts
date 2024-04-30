import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function getUserByUserName(userName: string) {
    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const userTable = dbContext.collection("users");
    const user = await userTable.findOne({ userName });

    return user;
}
