import { Bill, validate } from "@/api/models/bill";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function getBill(billId: string) {
    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const bills = dbContext.collection("bills");

    const billToFetch = await bills.findOne(new ObjectId(billId));

    if (!billToFetch) throw new Error(`Bill with ${billId} not found.`);

    return billToFetch;
}
