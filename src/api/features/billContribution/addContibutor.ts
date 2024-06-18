import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function addContibutor(userId: string, billId: string) {
    throw new Error("function to be implemented /  reworked")

    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const billTable = dbContext.collection("bills");
    const usersTable = dbContext.collection("users");

    const billToUpdate = await billTable.findOne(new ObjectId(billId));
    const userExists = await usersTable.findOne(new ObjectId(userId));

    if (!billToUpdate) {
        throw new Error(`No bill with ID: ${billId} found.`);
    }
    if (!userExists) {
        throw new Error(`No user with ID: ${userId} found.`);
    }

    const isUserAdded = (
        billToUpdate.contributors as Array<{ id: string; userName: string }>
    ).find((v) => v.userName === userExists.userName);

    if (billToUpdate.contributors?.length > 0 && isUserAdded) {
        return billToUpdate;
    }

    const result = await billTable.updateOne(
        { _id: billToUpdate._id },
        {
            $set: {
                contributors: [
                    ...billToUpdate.contributors,
                    { id: userExists._id, userName: userExists.userName },
                ],
            },
        }
    );

    return billToUpdate;
}
