import * as Realm from "realm-web";

export type user = {
  _id: Realm.BSON.ObjectId;
  createdAt?: Date;
  sessionToken?: string;
  userName?: string;
};

export const userSchema = {
  name: 'user',
  properties: {
    _id: 'objectId',
    createdAt: 'date?',
    sessionToken: 'string?',
    userName: 'string?',
  },
  primaryKey: '_id',
};
