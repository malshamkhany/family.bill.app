import * as Realm from "realm-web";

export type bill = {
  _id: Realm.BSON.ObjectId;
  billDate?: Date;
  contributors: bill_contributors[];
  createdAt?: Date;
  expenses: bill_expenses[];
  lastUpdated?: Date;
  status?: string;
  title?: string;
  totalAmount?: number;
};

export const billSchema = {
  name: 'bill',
  properties: {
    _id: 'objectId',
    billDate: 'date?',
    contributors: 'bill_contributors[]',
    createdAt: 'date?',
    expenses: 'bill_expenses[]',
    lastUpdated: 'date?',
    status: 'string?',
    title: 'string?',
    totalAmount: 'int?',
  },
  primaryKey: '_id',
};

export type bill_contributors = {
  billContributionId?: string;
  userId?: string;
  userName?: string;
};

export const bill_contributorsSchema = {
  name: 'bill_contributors',
  embedded: true,
  properties: {
    billContributionId: 'string?',
    userId: 'string?',
    userName: 'string?',
  },
};

export type bill_expenses = {
  amount?: number;
  createdAt?: Date;
  label?: string;
  paidBy?: string;
};

export const bill_expensesSchema = {
  name: 'bill_expenses',
  embedded: true,
  properties: {
    amount: 'int?',
    createdAt: 'date?',
    label: 'string?',
    paidBy: 'string?',
  },
};
