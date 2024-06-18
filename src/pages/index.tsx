import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Bill } from "@/api/models/bill";
import BottomNavigation from "@/components/bottomNavigation";
import moment from "moment";
import { useSnackNotification } from "@/hoc/SnackNotificationProvider";
import Loader from "@/components/Loader";
import { getSettlements } from "@/helpers";
import { BillContribution } from "@/api/models/billContribution";
import DotStatus from "@/components/DotStatus";
import ButtonLoader from "@/components/ButtonLoader";

// type ConnectionStatus = {
//   isConnected: boolean;
// };

// export const getServerSideProps: GetServerSideProps<ConnectionStatus> = async (
//   context
// ) => {
//   const bills = await listBill();
//   return {
//     props: { isConnected: true },
//   };
// };

export default function Home({ billId }: { billId?: string }) {
  // {
  //   isConnected,
  // }: InferGetServerSidePropsType<typeof getServerSideProps>
  const [bill, setBill] = useState<Bill>(null);
  const [notFound, setNotFound] = useState(false);
  const [billContribution, setBillContribution] = useState<BillContribution[]>(
    []
  );
  const { open } = useSnackNotification();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/user/logout`,
        { method: "POST" }
      );

      if (response.ok) {
        // Handle successful authentication
        open("Logout success", "success");
        router.push("/login", { scroll: false });
      }
    } catch (error) {
      open("Logout failed", "error");
      console.error("An error occurred while logging in:", error);
    }
  };

  useEffect(() => {
    if (billId) {
      fetch(`/api/bill?id=${billId}`).then((response) => {
        response.json().then(({ data, success }) => {
          if (!data) {
            setNotFound(true);
          }
          setBill(data);
        });
      });
    } else {
      fetch("/api/bill/current").then((response) => {
        response.json().then(({ data, success }) => {
          if (!data) {
            setNotFound(true);
          }
          setBill(data);
        });
      });
    }
  }, [billId]);

  useEffect(() => {
    if (bill?.contributors) {
      const ids = bill.contributors.map((c) => c.billContributionId);
      fetch("/api/billContributor/many", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ids),
      }).then((response) => {
        response.json().then(({ data, success }) => {
          setBillContribution(data);
        });
      }).catch(e => console.log(e));
    }
  }, [bill]);

  if (notFound) {
    return (
      <div>
        <div className="header container mx-auto px-6 py-4 gap-2">
          <Image src="/icons/home.svg" alt="home" width={25} height={25} />
          <h1 className="font-[Lakes-ExtraBold]">Our Rent is Due</h1>
        </div>
        <div className="containerMain container mx-auto px-4 text-center">
          There is no bill. 🙄
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!bill) {
    return <Loader />;
  }

  const groupedExpenses = bill.expenses.reduce((acc, expense) => {
    const { paidBy } = expense;
    if (!acc[paidBy]) {
      acc[paidBy] = [];
    }
    acc[paidBy].push(expense);

    return acc;
  }, {});

  const payingExpenses = Object.keys(groupedExpenses).map((paidBy) => ({
    paidBy,
    expenses: groupedExpenses[paidBy],
  }));

  const HandleEditExpense = () => {
    router.push(`/bill/${bill._id}`);
  };

  const handleStatusUpdate = () => {
    setLoading(true);
    const billToUpdate = {
      ...bill,
      status: bill.status === "pending" ? "settled" : "pending",
    };
    updateBill(billToUpdate)
      .then(() => {
        open(
          bill.status === "pending"
            ? "Bill marked as settled."
            : "Bill reopened",
          "success"
        );
        setBill(billToUpdate);
      })
      .catch((e) => {
        open("Failed to update bill.", "error");
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  const calculatedPayouts = getSettlements(bill);

  const hasAnyOneTransfered =
    billContribution.length !== 0 &&
    billContribution.find((m) => m.transfers.length > 0);

  return (
    <>
      <div className="header container mx-auto px-6 py-4 gap-2">
        <Image src="/icons/home.svg" alt="home" width={25} height={25} />
        <h1 className="font-[Lakes-ExtraBold]">Our Rent is Due</h1>
        {/* <button onClick={handleLogout}>Logout</button> */}
      </div>
      <div className="containerMain container mx-auto px-4">
        <div className="currentDue items-center">
          <div className="leading-5">
            <div className="font-[Lakes-Bold]">
              {billId ? (
                <span className="capitalize">{bill.status}</span>
              ) : (
                "Current Month"
              )}
            </div>
            <div className="flex gap-2 items-center font-[Lakes-Regular]">
              Status:{" "}
              <DotStatus status={bill.status as "settled" | "pending"} />
            </div>
          </div>
          <button
            className="text-white py-2 px-4 rounded-full flex gap-2 items-center"
            style={{
              backgroundColor: bill.status === "pending" ? "#39ace7" : "gray",
            }}
            disabled={bill.status !== "pending"}
            onClick={HandleEditExpense}
          >
            Edit your expense
            <Image
              className="cursor-pointer"
              src="/icons/pencil.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </button>
        </div>

        <div className="dateItem">
          <Image
            src="/icons/calendar.svg"
            alt="calendar"
            width={25}
            height={25}
          />
          <span className="expenseTitle">
            {moment(bill.billDate).format("MMM DD, YYYY")}
          </span>
        </div>
        <div className="detailsRow">
          <span className="expenseTitle">Contributor:</span>
          <span className="expenseAmount">AED</span>
        </div>
        <div className="expensesContainer">
          {payingExpenses.map((n, index) => (
            <div key={n.paidBy + index}>
              <div className="contributorItem grid grid-cols-8 gap-4 ">
                <div className="flex gap-2 justify-left items-center border-r border-[#414c50] py-3 col-span-3">
                  <div className="bg-[#414c50] text-white font-bold py-2 px-3 rounded-full">
                    {n.paidBy}
                  </div>
                </div>
                <div className="py-4 col-span-5">
                  {n.expenses.map((expense, index) => (
                    <div className="expenseItem" key={expense.label + index}>
                      <li className="expenseTitle">{expense.label}</li>
                      <span className="expenseAmount">{expense.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-t border-[#414c50]" />
            </div>
          ))}
        </div>

        <div className="amountDueContainer">
          <div className="expenseItem">
            <span className="expenseTitle">Total</span>
            <span className="expenseAmount">{bill.totalAmount}</span>
          </div>
          <div className="expenseItem">
            <span className="expenseTitle">
              Total (split by {bill.contributors.length})
            </span>
            <span className="expenseAmount">
              {parseFloat(
                (bill.totalAmount / bill.contributors.length).toFixed(2)
              )}
            </span>
          </div>
        </div>
        <p className="text-xs font-[Lakes-Bold] text-center my-2">
          Last updated: {moment(bill.lastUpdated).format("lll")}
        </p>
        <p className="pb-3 font-[Lakes-Bold]">Contributors:</p>
        <div className="flex gap-4 justify-start">
          {bill.contributors.map((contributor) => (
            <ContributorBubble key={contributor.userId}>
              {contributor.userName}
            </ContributorBubble>
          ))}
        </div>

        <div className="mt-3">
          <p className="pb-3 font-[Lakes-Bold]">Calculated Payout:</p>
          {calculatedPayouts.settlements.map((m, i) => (
            <div
              className="flex gap-3 items-center justify-start flex-wrap mb-3"
              key={`${m.debtor}_${i}`}
            >
              <ContributorBubble>{m.debtor}</ContributorBubble>
              <p className="font-bold text-md capitalize text-center">to</p>
              <ContributorBubble>{m.creditor}</ContributorBubble>
              <Image
                src="/icons/transfer.svg"
                alt="cash"
                width={25}
                height={25}
              />
              <CashBubble>
                {Math.round(m.settlementAmount * 100) / 100}
              </CashBubble>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="font-[Lakes-Bold] pb-3">Current Transfers:</div>
          {!hasAnyOneTransfered ? (
            <div>No one transferred yet.</div>
          ) : (
            billContribution.map((m) => (
              <div key={m.userId}>
                {m.transfers.map((t, i) => (
                  <div
                    key={`${m.userId}_${i}`}
                    className="flex gap-x-3 items-center justify-start flex-wrap mb-3"
                  >
                    <ContributorBubble>
                      {bill.contributors.find((u) => u.userId === t.from)
                        ?.userName || "Unknown"}
                    </ContributorBubble>
                    <p className="font-bold text-md capitalize text-center">
                      to
                    </p>
                    <ContributorBubble>
                      {bill.contributors.find((u) => u.userId === t.to)
                        ?.userName || "Unknown"}
                    </ContributorBubble>
                    <Image
                      src="/icons/transfer.svg"
                      alt="cash"
                      width={25}
                      height={25}
                    />
                    <CashBubble>{Math.round(t.amount * 100) / 100}</CashBubble>
                    <p className="text-xs font-[Lakes-Bold] my-1">
                      -- Transfer date: {moment(t.transferDate).format("lll")}
                    </p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center">
          <button
            className="bg-[#39ace7] text-white py-2 px-4 rounded-full flex gap-2 items-center"
            disabled={loading}
            style={{ filter: `grayscale(${loading ? "1" : "0"})` }}
            onClick={handleStatusUpdate}
          >
            {loading ? (
              <ButtonLoader className="h-6 w-20 scale-50" />
            ) : bill.status === "pending" ? (
              <>
                <Image
                  className="cursor-pointer"
                  src="/icons/checkmark.svg"
                  alt="checkmark"
                  width={20}
                  height={20}
                />
                Mark as settled
              </>
            ) : (
              <>
                <Image
                  className="cursor-pointer"
                  src="/icons/pencil.svg"
                  alt="checkmark"
                  width={20}
                  height={20}
                />
                Reopen
              </>
            )}
          </button>
        </div>

        <div className="mb-32" />
      </div>
      <BottomNavigation />
    </>
  );
}

const ContributorBubble = ({ children, ...rest }) => {
  return (
    <div
      className="bg-purple-800 font-[Lakes-ExtraBold] text-white font-bold py-2 px-4 rounded-full"
      {...rest}
    >
      {children}
    </div>
  );
};

const CashBubble = ({ children, ...rest }) => {
  return (
    <div
      className="bg-green-600 font-[Lakes-ExtraBold] text-white font-bold py-2 px-4 rounded-full"
      {...rest}
    >
      {children}
    </div>
  );
};

const updateBill = async (bill: any) => {
  const response = await fetch("/api/bill", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bill),
  });
  const result = await response.json();

  if (result.success) return result.data;

  return null;
};
