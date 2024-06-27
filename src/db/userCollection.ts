import { user } from "@/db/models/user";
import { BSON } from "realm-web";

class UserCollection {
  private collection: globalThis.Realm.Services.MongoDB.MongoDBCollection<user>;

  constructor(mongoClient: globalThis.Realm.Services.MongoDB) {
    this.collection = mongoClient
      .db(process.env.NEXT_PUBLIC_DATABASE_NAME)
      .collection(process.env.NEXT_PUBLIC_DATABASE_USER_COLLECTION);
  }

  async createBill(user: user) {
    try {
      const result = await this.collection.insertOne(user);
      return result;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const result = await this.collection.findOne({
        _id: new BSON.ObjectId(id),
      });

      return result;
    } catch (error) {
      console.error("Failed to get user", error);
      throw error;
    }
  }

  async getUserByUserName(userName: string) {
    try {
      const result = await this.collection.find({ userName });
      if (result.length === 0) return null;

      return result[0];
    } catch (error) {
      console.error("Failed to get user", error);
      throw error;
    }
  }

  async readUsers(query: Query = {}) {
    try {
      const result = await this.collection.find(query);
      return result;
    } catch (error) {
      console.error("Failed to read users:", error);
      throw error;
    }
  }

  async updateUser(query: Query, update: Update) {
    try {
      const result = await this.collection.updateOne(query, update);
      return result;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  }

  async deleteUser(query: Query) {
    try {
      const result = await this.collection.deleteOne(query);
      return result;
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  }
}

type Query = globalThis.Realm.Services.MongoDB.Filter;
type Update = globalThis.Realm.Services.MongoDB.Update;

export default UserCollection;
