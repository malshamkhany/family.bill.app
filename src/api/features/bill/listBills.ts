import clientPromise from "@/lib/mongodb";

export default async function listBill() {
    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const bills = dbContext.collection("bills");
    const result = bills.find().sort("createdAt", "descending").toArray();

    return result;
}
