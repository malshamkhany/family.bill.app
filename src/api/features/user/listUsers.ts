import clientPromise from "@/lib/mongodb";

export default async function listUsers() {
    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const users = dbContext.collection("users");
    const result = users.find().sort("createdAt", "descending").toArray();

    return result;
}
