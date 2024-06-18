import { Bill, validate } from "@/api/models/bill";
import clientPromise from "@/lib/mongodb";
import listUsers from "../user/listUsers";
import { BillContribution } from "@/api/models/billContribution";
import createContributor from "../billContribution/createContibutor";

export default async function createBill(bill: Bill) {

    const validationResult = validate(bill);
    if (validationResult.success === false) {
        console.log(validationResult.error.issues);
        throw new Error("Bad JSON");
    }

    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const bills = dbContext.collection("bills");

    let totalAmount = 0;
    bill.expenses.forEach((a) => (totalAmount += a.amount));
    bill.totalAmount = totalAmount;

    const {_id, ...rest} = bill; // sperate _id cuz mongo / type does not accept insert
    const updatedBill = {...rest};

    const result = await bills.insertOne(updatedBill);

    // auto-add all contributors.
    // TODO: in future, have to user add contributors via api requests
    const users = await listUsers();
    let contributorList: typeof bill.contributors = [];
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const billContribution: BillContribution = {
            billId: result.insertedId.toString(),
            transfers: [],
            userId: user._id.toString(),
            userName: user.userName,
        };
        const created = await createContributor(billContribution);
        if (created.acknowledged) {
            contributorList = [
                ...contributorList,
                {
                    billContributionId: created.insertedId.toString(),
                    userId: billContribution.userId,
                    userName: billContribution.userName,
                },
            ];
        } else console.log("failed to create contributor");
    }

    if (contributorList.length > 0) {
        await bills.updateOne(
            { _id: result.insertedId },
            { $set: { contributors: contributorList, lastUpdated: new Date() } }
        );
    }

    return result;
}
