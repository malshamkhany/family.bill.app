import clientPromise from "@/lib/mongodb";

export default async function getCurrentBill() {
    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const bills = dbContext.collection("bills");
    const lastCreatedBill = await bills.findOne(
        {},
        { sort: { createdAt: -1 } }
    );

    return lastCreatedBill;
}
