import * as Realm from "realm-web";
import BillCollection from "./billCollection";
import BillContrutionCollection from "./billContributionCollection";
import UserCollection from "./userCollection";

class MongoDbContext {
  public app: Realm.App;
  public mongoClient: globalThis.Realm.Services.MongoDB;
  public billCollection: BillCollection;
  public billContributionCollection: BillContrutionCollection
  public userCollection: UserCollection

  constructor() {
    this.app = new Realm.App({ id: process.env.NEXT_PUBLIC_DATABASE_ID });
  }

  async connect() {
    try {
      // sign in mongo db user if not signed
      let user = this.app.currentUser;

      if (user) {
        this.mongoClient = user.mongoClient(
          process.env.NEXT_PUBLIC_DATABASE_SERVICE_NAME
        );
      } else {
        user = await this.app.logIn(
          Realm.Credentials.apiKey(process.env.NEXT_PUBLIC_DATABASE_API_KEY)
        );
        this.mongoClient = user.mongoClient(
          process.env.NEXT_PUBLIC_DATABASE_SERVICE_NAME
        );
      }

      // register collections
      this.billCollection = new BillCollection(this.mongoClient);
      this.billContributionCollection = new BillContrutionCollection(this.mongoClient);
      this.userCollection = new UserCollection(this.mongoClient);
    } catch (error) {
      console.error("failed to login to database. check network access");
    }
  }
}

export default MongoDbContext;
