import { bill } from "@/db/models/bill";

export function nestedJsonParseToDate(jsonObj: any, keys: string[]): any {
  function traverse(obj: any) {
    if (typeof obj === "object") {
      if (Array.isArray(obj)) {
        obj.forEach((item) => traverse(item));
      } else {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (keys.includes(key)) {
              if (
                typeof obj[key] === "string" &&
                obj[key].match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
              ) {
                obj[key] = new Date(obj[key]);
              }
            }
            traverse(obj[key]);
          }
        }
      }
    }
  }

  traverse(jsonObj);

  return jsonObj;
}

// Function to get the billContributionId by userId
export function getBillContributionIdByUserId(contributions, userId) {
  const contribution = contributions.find(
    (contribution) => contribution.userId === userId
  );
  return contribution ? contribution.billContributionId : null;
}

export function getAmountTrasferredTo(transfers, toId) {
  const transfer = transfers.find((t) => t.to === toId);
  return transfer ? transfer.amount : 0;
}

export const getSettlements = (bill: bill) => {
  // Define participants and their total payments
  // Define the number of participants
  const participants = {};
  const numberOfParticipants = bill.contributors.length;
  bill.contributors.forEach((e) => {
    participants[e.userName] = bill.expenses.reduce(
      (sum, expense) =>
        expense.paidBy === e.userName ? sum + expense.amount : sum,
      0
    );
  });

  // Calculate the equal share each participant should pay
  const equalShare = bill.totalAmount / numberOfParticipants;

  // Calculate the amount each participant needs to pay or receive
  const balances = {};
  for (let participant in participants) {
    balances[participant] = participants[participant] - equalShare;
  }

  // Function to settle debts
  function settleDebts(balances) {
    let settlements: {
      debtor: string;
      creditor: string;
      settlementAmount: number;
    }[] = [];
    let debtors = [];
    let creditors = [];

    // Separate debtors and creditors
    for (let participant in balances) {
      if (balances[participant] < 0) {
        debtors.push({
          name: participant,
          balance: balances[participant],
        });
      } else if (balances[participant] > 0) {
        creditors.push({
          name: participant,
          balance: balances[participant],
        });
      }
    }
    // Settle the debts
    while (debtors.length > 0 && creditors.length > 0) {
      let debtor = debtors[0];
      let creditor = creditors[0];

      let settlementAmount = Math.min(-debtor.balance, creditor.balance);
      settlements.push({
        debtor: debtor.name,
        creditor: creditor.name,
        settlementAmount,
      });

      debtor.balance += settlementAmount;
      creditor.balance -= settlementAmount;

      if (debtor.balance === 0) {
        debtors.shift();
      }

      if (creditor.balance === 0) {
        creditors.shift();
      }
    }

    return settlements;
  }

  // Get the settlements
  return {
    settlements: settleDebts(balances),
    balances,
    totalPaidBy: participants,
  };
};

export const parseAndRound = (str: string) => {
  // Attempt to parse the string to a float
  let num = parseFloat(str);

  // Check if the result is a number
  if (isNaN(num)) {
    return 0;
  }

  // Round to two decimal points
  return Math.round(num * 100) / 100;
};