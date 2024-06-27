import * as Realm from "realm-web";

export type billcontribution = {
  _id: Realm.BSON.ObjectId;
  billId?: string;
  lastUpdated?: Date;
  transfers: billcontribution_transfers[];
  userId?: string;
  userName?: string;
};

export const billcontributionSchema = {
  name: 'billcontribution',
  properties: {
    _id: 'objectId',
    billId: 'string?',
    lastUpdated: 'date?',
    transfers: 'billcontribution_transfers[]',
    userId: 'string?',
    userName: 'string?',
  },
  primaryKey: '_id',
};

export type billcontribution_transfers = {
  amount?: unknown;
  from?: string;
  to?: string;
  transferDate?: string;
};

export const billcontribution_transfersSchema = {
  name: 'billcontribution_transfers',
  embedded: true,
  properties: {
    amount: 'mixed',
    from: 'string?',
    to: 'string?',
    transferDate: 'string?',
  },
};
