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

const BillGraph = dynamic(() => import("@/components/BillGraph"), {
  ssr: false,
});

const HistoryList = () => {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState<String>("");
  const [selectedView, setSelectedView] = useState<"list" | "graph">("list");

  const toggleAccordion = (_id) => {
    if (_id === isOpen) {
      setIsOpen("");
      return;
    }
    setIsOpen(_id);
  };

  useEffect(() => {
    fetch("/api/bill").then((response) => {
      response.json().then(({ data, success }) => {
        setHistory(data);
      });
    });
  }, []);

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
          history.reverse().map((item, index) => {
            const payingExpenses = getExpensesGroup(item.expenses);
            return (
              <div key={item.billDate} className="mb-5">
                <Accordion
                  isOpen={isOpen === item._id}
                  toggleAccordion={() => toggleAccordion(item._id)}
                  header={
                    <div
                      className="item"
                      style={{
                        backgroundColor:
                          isOpen === item._id ? "#0784b5" : "#414c50",
                      }}
                    >
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
                      <div className="totalAmount">{item.totalAmount} AED</div>
                    </div>
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

export default HistoryList;

// const data = [
//   {
//     label: "Jun 1, 2022",
//     y: 9833,
//     x: 1654027200000,
//   },
//   {
//     label: "Jul 1, 2022",
//     y: 11066,
//     x: 1656619200000,
//   },
//   {
//     label: "Aug 1, 2022",
//     y: 12235,
//     x: 1659297600000,
//   },
//   {
//     label: "Sep 1, 2022",
//     y: 12806,
//     x: 1661976000000,
//   },
//   {
//     label: "Oct 1, 2022",
//     y: 8478,
//     x: 1664568000000,
//   },
//   {
//     label: "Nov 1, 2022",
//     y: 11603,
//     x: 1667246400000,
//   },
//   {
//     label: "Dec 1, 2022",
//     y: 8002,
//     x: 1669838400000,
//   },
//   {
//     label: "Jan 1, 2023",
//     y: 7214,
//     x: 1672516800000,
//   },
//   {
//     label: "Feb 1, 2023",
//     y: 11509,
//     x: 1675195200000,
//   },
//   {
//     label: "Mar 1, 2023",
//     y: 9032,
//     x: 1677614400000,
//   },
//   {
//     label: "Apr 1, 2023",
//     y: 5267,
//     x: 1680292800000,
//   },
//   {
//     label: "May 1, 2023",
//     y: 11229,
//     x: 1682884800000,
//   },
//   {
//     label: "Jun 1, 2023",
//     y: 6673,
//     x: 1685563200000,
//   },
//   {
//     label: "Jul 1, 2023",
//     y: 12633,
//     x: 1688155200000,
//   },
//   {
//     label: "Aug 1, 2023",
//     y: 10921,
//     x: 1690833600000,
//   },
//   {
//     label: "Sep 1, 2023",
//     y: 5933,
//     x: 1693512000000,
//   },
//   {
//     label: "Oct 1, 2023",
//     y: 12105,
//     x: 1696104000000,
//   },
//   {
//     label: "Nov 1, 2023",
//     y: 7943,
//     x: 1698782400000,
//   },
//   {
//     label: "Dec 1, 2023",
//     y: 8172,
//     x: 1701374400000,
//   },
//   {
//     label: "Jan 1, 2024",
//     y: 9959,
//     x: 1704052800000,
//   },
//   {
//     label: "Feb 1, 2024",
//     y: 11639,
//     x: 1706731200000,
//   },
//   {
//     label: "Mar 1, 2024",
//     y: 5475,
//     x: 1709236800000,
//   },
//   {
//     label: "Mar 1, 2024",
//     y: 3475,
//     x: 1709236800000,
//   },
//   {
//     label: "Apr 1, 2024",
//     y: 11760,
//     x: 1711915200000,
//   },
//   {
//     label: "May 1, 2024",
//     y: 10240,
//     x: 1714507200000,
//   },
//   {
//     label: "Jun 1, 2024",
//     y: 9839,
//     x: 1717185600000,
//   },
//   {
//     label: "Jun 1, 2024",
//     y: 1839,
//     x: 1717185600000,
//   },
// ];

// const dataNormalizedSet = new Map<number, (typeof data)[0]>();
// data.forEach((d) => {
//   const key = moment(new Date(d.x))
//     .startOf("month")
//     .startOf("day")
//     .toDate()
//     .getTime();
//   if (dataNormalizedSet.has(key)) {
//     const pre = dataNormalizedSet.get(key);
//     dataNormalizedSet.set(key, { ...pre, y: pre.y + d.y });
//   } else {
//     dataNormalizedSet.set(key, d);
//   }
// });
