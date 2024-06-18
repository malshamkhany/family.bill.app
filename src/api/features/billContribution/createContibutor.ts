import clientPromise from "@/lib/mongodb";
import { BillContribution, validate } from "@/api/models/billContribution";

export default async function createContributor(
  billContribution: BillContribution
) {
  const validationResult = validate(billContribution);

  if (validationResult.success === false) {
    console.log(validationResult.error.issues);
    throw new Error("Bad JSON");
  }

  const client = await clientPromise;
  const dbContext = client.db(process.env.DB_NAME);

  const bills = dbContext.collection("billcontributions");

  const { _id, ...rest } = billContribution;
  const typeCorrectedBill = { ...rest };
  typeCorrectedBill.lastUpdated = new Date();

  const result = await bills.insertOne(typeCorrectedBill);

  return result;
}
