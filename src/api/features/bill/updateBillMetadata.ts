import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type Metadata = {
    title: string;
    billDate: Date;
    status: string;
};

export default async function updateBillMetadata(
    billId: string,
    metadata: Metadata
) {
    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const bills = dbContext.collection("bills");

    const billToUpdate = await bills.findOne(new ObjectId(billId));

    if (!billToUpdate) throw new Error(`Bill with ${billId} not found.`);

    const result = await bills.updateOne(
        { _id: billToUpdate._id },
        {
            $set: { ...metadata },
        }
    );

    return result;
}
