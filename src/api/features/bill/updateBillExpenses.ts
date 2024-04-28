import { Bill, validate } from "@/api/models/bill";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type Expenses = {
    label: string;
    amount: number;
    paidBy: string;
    createdAt: Date;
};

export default async function updateBillExpenses(
    billId: string,
    expenses: Expenses[]
) {
    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const bills = dbContext.collection("bills");

    const billToUpdate = await bills.findOne(new ObjectId(billId));

    if (!billToUpdate) throw new Error(`Bill with ${billId} not found.`);

    let totalAmount = 0;
    expenses.forEach((a) => (totalAmount += a.amount));
    const result = await bills.updateOne(
        { _id: billToUpdate._id },
        {
            $set: { expenses, totalAmount },
        }
    );

    return result;
}
