import { Bill, validate } from "@/api/models/bill";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function getContributor(billContributorId: string) {
    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const billContributors = dbContext.collection("billcontributions");

    const billContributorToFetch = await billContributors.findOne(
        new ObjectId(billContributorId)
    );

    if (!billContributorToFetch)
        throw new Error(`Bill with ${billContributorId} not found.`);

    return billContributorToFetch;
}
