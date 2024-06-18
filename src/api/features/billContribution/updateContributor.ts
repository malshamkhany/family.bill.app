import clientPromise from "@/lib/mongodb";
import { BillContribution, validate } from "@/api/models/billContribution";
import { ObjectId } from "mongodb";

export default async function updateContributor(
    billContribution: BillContribution
) {
    billContribution.lastUpdated = new Date();
    
    const validationResult = validate(billContribution);

    if (validationResult.success === false) {
        console.log(validationResult.error.issues);
        throw new Error("Bad JSON");
    }

    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const bills = dbContext.collection("billcontributions");

    const storeId = billContribution["_id"] as string;
    delete billContribution["_id"]


    const result = await bills.updateOne(
        { _id: new ObjectId(storeId) },
        { $set: { ...billContribution } }
    );


    return result;
}
