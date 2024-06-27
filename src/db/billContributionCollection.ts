import { billcontribution } from "@/db/models/billContribution";
import { BSON } from "realm-web";

class BillContrutionCollection {
  private collection: globalThis.Realm.Services.MongoDB.MongoDBCollection<billcontribution>;

  constructor(mongoClient: globalThis.Realm.Services.MongoDB) {
    this.collection = mongoClient
      .db(process.env.NEXT_PUBLIC_DATABASE_NAME)
      .collection(process.env.NEXT_PUBLIC_DATABASE_BILL_CONTRIBUTION_COLLECTION);
  }

  async createContributionBill(billcontribution: billcontribution) {
    try {
      const result = await this.collection.insertOne(billcontribution);
      return result;
    } catch (error) {
      console.error("Failed to create billcontribution:", error);
      throw error;
    }
  }

  async getContributionBillById(id: string) {
    try {
      const result = await this.collection.findOne({
        _id: new BSON.ObjectId(id),
      });

      return result;
    } catch (error) {
      console.error("Failed to get contribution bill:", error);
      throw error;
    }
  }

  async readContributionBills(query: Query = {}) {
    try {
      const result = await this.collection.find(query);
      return result;
    } catch (error) {
      console.error("Failed to read billcontribution:", error);
      throw error;
    }
  }

  async updateContributionBill(query: Query, update: Update) {
    try {
      const result = await this.collection.updateOne(query, update);
      return result;
    } catch (error) {
      console.error("Failed to update billcontribution:", error);
      throw error;
    }
  }

  async deleteContributionBill(query: Query) {
    try {
      const result = await this.collection.deleteOne(query);
      return result;
    } catch (error) {
      console.error("Failed to delete billcontribution:", error);
      throw error;
    }
  }
}

type Query = globalThis.Realm.Services.MongoDB.Filter;
type Update = globalThis.Realm.Services.MongoDB.Update;

export default BillContrutionCollection;
