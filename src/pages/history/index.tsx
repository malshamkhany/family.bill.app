import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import BottomNavigation from "@/components/bottomNavigation";
import Accordion from "@/components/Accordion";
import HistoryTabs from "@/components/HistoryTabs";
import dynamic from "next/dynamic";
import DotStatus from "@/components/DotStatus";
import Loader from "@/components/Loader";
import { useDb } from "@/hoc/DbProvider";
import withAuth from "@/hoc/withAuth";

const BillGraph = dynamic(() => import("@/components/BillGraph"), {
  ssr: false,
});

const HistoryList = () => {
  const db = useDb();
  const [history, setHistory] = useState([]);

  const [selectedView, setSelectedView] = useState<"list" | "graph">("list");

  useEffect(() => {
    db.billCollection
      .readBills({}, { sort: { billDate: -1 } })
      .then((data) => setHistory(data))
      .catch(() => {
        open("Something went wrong.", "error");
      });
  }, [db.billCollection]);

  const getExpensesGroup = (expenses) => {
    const groupedExpenses = expenses.reduce((acc, expense) => {
      const { paidBy } = expense;
      if (!acc[paidBy]) {
        acc[paidBy] = [];
      }
      acc[paidBy].push(expense);

      return acc;
    }, {});

    const payingExpenses = Object.keys(groupedExpenses || []).map((paidBy) => ({
      paidBy,
      expenses: groupedExpenses[paidBy],
    }));
    return payingExpenses;
  };

  type GraphData = {
    label: string;
    y: number;
    x: number;
  };

  const normalizedDataset = new Map<number, GraphData>();

  history.forEach((d) => {
    const normalDate = moment(new Date(d.billDate))
      .startOf("month")
      .startOf("day");

    const key = normalDate.toDate().getTime();

    if (normalizedDataset.has(key)) {
      const pre = normalizedDataset.get(key);
      normalizedDataset.set(key, { ...pre, y: pre.y + d.totalAmount });
    } else {
      normalizedDataset.set(key, {
        label: normalDate.format("ll"),
        x: key,
        y: d.totalAmount,
      });
    }
  });

  // const daysBehind = 24;

  // for (let i = daysBehind; i >= 0; i--) {
  //   const randomY = Math.floor(Math.random() * (13000 - 5000 + 1)) + 5000;
  //   const date = moment().subtract(i, "month").startOf("month").startOf("day");
  //   data.push({
  //     label: date.format("ll"),
  //     y: randomY,
  //     x: date.toDate().getTime(),
  //   });
  // }

  if (!history?.length) {
    return (
      <>
        <div className="header container mx-auto px-6 py-4 gap-2 mb-1 z-[1000]">
          <Image src="/icons/calendar.svg" alt="home" width={25} height={25} />
          <h1>History</h1>
        </div>

        <div className="container mx-auto px-6 py-4 mb-24">
          <div className="mx-auto w-fit mb-4">
            <HistoryTabs
              selected={selectedView}
              onTabChange={(tab) => setSelectedView(tab)}
            />
          </div>

          <Loader />
        </div>
        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <div className="header container mx-auto px-6 py-4 gap-2 mb-1 z-[1000]">
        <Image src="/icons/calendar.svg" alt="home" width={25} height={25} />
        <h1>History</h1>
      </div>

      <div className="container mx-auto px-6 py-4 mb-24">
        <div className="mx-auto w-fit mb-4">
          <HistoryTabs
            selected={selectedView}
            onTabChange={(tab) => setSelectedView(tab)}
          />
        </div>

        {selectedView === "list" &&
          history.map((item, index) => {
            const payingExpenses = getExpensesGroup(item.expenses);
            return (
              <div key={item._id} className="mb-5">
                <Accordion
                  header={
                    <>
                      <div className="date">
                        <div className="flex justify-center items-center">
                          <DotStatus status={item.status} />
                        </div>
                        <Image
                          src="/icons/cash.svg"
                          alt="cash"
                          width={25}
                          height={25}
                        />{" "}
                        {moment(item.billDate).format("MMM DD, YYYY")}
                      </div>
                      <div className="totalAmount">{ Math.round(item.totalAmount)} AED</div>
                    </>
                  }
                  content={
                    <div className="px-3">
                      <div className="detailsRow">
                        <span className="expenseTitle">Details:</span>
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
                                  <div
                                    className="expenseItem"
                                    key={expense.label + index}
                                  >
                                    <li className="expenseTitle">
                                      {expense.label}
                                    </li>
                                    <span className="expenseAmount">
                                      {expense.amount}
                                    </span>
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
                          <span className="expenseAmount">
                            {item.totalAmount}
                          </span>
                        </div>
                        <div className="expenseItem">
                          <span className="expenseTitle">
                            Total (split by 3)
                          </span>
                          <span className="expenseAmount">
                            {parseFloat(
                              (
                                item.totalAmount / item.contributors.length
                              ).toFixed(2)
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-center mt-2">
                          <Link
                            className="bg-[#39ace7] text-white py-2 px-4 rounded-full"
                            href={`/history/${item._id}`}
                          >
                            View details
                          </Link>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })}

        {selectedView === "graph" && (
          <div className="mt-6">
            <BillGraph
              data={Array.from(normalizedDataset.values()).reverse()}
            />
          </div>
        )}
      </div>
      <BottomNavigation />
    </>
  );
};

export default withAuth(HistoryList);
