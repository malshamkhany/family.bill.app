import { Bill, validate } from "@/api/models/bill";
import clientPromise from "@/lib/mongodb";
import listUsers from "../user/listUsers";

export default async function createBill(bill: Bill) {
    const validationResult = validate(bill);

    if (validationResult.success === false) {
        console.log(validationResult.error.issues);
        throw new Error("Bad JSON");
    }

    const client = await clientPromise;
    const dbContext = client.db(process.env.DB_NAME);

    const bills = dbContext.collection("bills");

    //TODO: remove below and change dynamic implementation of adding contributors
    const getContributors = await listUsers();
    const restructure_contributors = [];
    getContributors.forEach((i) => {
        restructure_contributors.push({ id: i._id, userName: i.userName });
    });
    bill.contributors = restructure_contributors;

    let totalAmount = 0;
    bill.expenses.forEach((a) => (totalAmount += a.amount));
    bill.totalAmount = totalAmount;

    const result = await bills.insertOne(bill);

    return result;
}
