import { Bill } from "@/api/models/bill";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function updateBill(
    bill: Bill
) {
    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const bills = dbContext.collection("bills");

    const billToUpdate = await bills.findOne(new ObjectId(bill._id));

    if (!billToUpdate) throw new Error(`Bill with ${bill._id} not found.`);

    
    let totalAmount = 0;
    bill.expenses.forEach((a) => (totalAmount += a.amount));
    bill.totalAmount = totalAmount;
    bill.lastUpdated = new Date();

    delete bill._id
    
    const result = await bills.updateOne(
        { _id: new ObjectId(billToUpdate._id) },
        {
            $set: { ...bill },
        }
    );

    return result;
}