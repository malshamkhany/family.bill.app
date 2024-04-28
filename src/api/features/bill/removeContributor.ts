import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function removeContributor(
    userId: string,
    billId: string
) {
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

    if (
        billToUpdate.contributors?.length > 0 &&
        !billToUpdate.contributors.includes(userId)
    ) {
        return billToUpdate;
    }

    const copyList = [...billToUpdate.contributors];
    const index = copyList.indexOf({
        id: userExists._id,
        userName: userExists.userName,
    });
    const newList = copyList.splice(index, 1);

    billToUpdate.contributors = newList;

    const result = await billTable.updateOne(
        { _id: billToUpdate._id },
        {
            $set: { contributors: newList },
        }
    );

    return billToUpdate;
}
