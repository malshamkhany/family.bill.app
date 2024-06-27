import { bill } from "@/db/models/bill";
import { BSON } from "realm-web";

class BillCollection {
  private collection: globalThis.Realm.Services.MongoDB.MongoDBCollection<bill>;

  constructor(mongoClient: globalThis.Realm.Services.MongoDB) {
    this.collection = mongoClient
      .db(process.env.NEXT_PUBLIC_DATABASE_NAME)
      .collection(process.env.NEXT_PUBLIC_DATABASE_BILL_COLLECTION);
  }

  async createBill(bill: bill) {
    try {
      const result = await this.collection.insertOne(bill);
      return result;
    } catch (error) {
      console.error("Failed to create bill:", error);
      throw error;
    }
  }

  async getBillById(id: string) {
    try {
      const result = await this.collection.findOne({
        _id: new BSON.ObjectId(id),
      });

      return result;
    } catch (error) {
      console.error("Failed to get bill:", error);
      throw error;
    }
  }

  async getCurrentBill() {
    try {
      const result = await this.collection.findOne(
        {},
        { sort: { createdAt: -1 } }
      );

      return result;
    } catch (error) {
      console.error("Failed to get current bill:", error);
      throw error;
    }
  }

  async readBills(query: Query = {}, options: FindOptions = {}) {
    try {
      const result = await this.collection.find(query, options);
      return result;
    } catch (error) {
      console.error("Failed to read bills:", error);
      throw error;
    }
  }

  async updateBill(query: Query, update: Update) {
    try {
      const result = await this.collection.updateOne(query, update);
      return result;
    } catch (error) {
      console.error("Failed to update bill:", error);
      throw error;
    }
  }

  async deleteBill(query: Query) {
    try {
      const result = await this.collection.deleteOne(query);
      return result;
    } catch (error) {
      console.error("Failed to delete bill:", error);
      throw error;
    }
  }
}

type Query = globalThis.Realm.Services.MongoDB.Filter;
type FindOptions = Realm.Services.MongoDB.FindOptions
type Update = globalThis.Realm.Services.MongoDB.Update;

export default BillCollection;
