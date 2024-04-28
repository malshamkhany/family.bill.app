import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import BottomNavigation from "@/components/bottomNavigation";

const thelistedBillJson = [
    {
        title: "bil1",
        billDate: "2024-01-24T00:00:00+04:00",
        expenses: [
            {
                label: "elife",
                amount: 375,
                paidBy: "khalid",
                createdAt: "2024-01-24T00:00:00+04:00",
            },
            {
                label: "electricity",
                amount: 562,
                paidBy: "khalid",
                createdAt: "2024-01-24T00:00:00+04:00",
            },
            { label: "fatima", amount: 600, paidBy: "wisam" },
            {
                label: "rent",
                amount: 5250,
                paidBy: "khalid",
                createdAt: "2024-01-24T00:00:00+04:00",
            },
            { label: "meow fund", amount: 200, paidBy: "wisam" },
            {
                label: "mama flight",
                amount: 952.75,
                paidBy: "khalid",
                createdAt: "2024-01-24T00:00:00+04:00",
            },
            {
                label: "majid fees",
                amount: 2064,
                paidBy: "wisam",
                createdAt: "2024-01-24T00:00:00+04:00",
            },
        ],
        contributors: ["wisam", "khalid"],
        status: "completed",
        createdAt: "2024-01-24T00:00:00+04:00",
    },
    {
        title: "bil2",
        billDate: "2024-02-23T00:00:00+04:00",
        expenses: [
            {
                label: "elife",
                amount: 375,
                paidBy: "khalid",
                createdAt: "2024-02-23T00:00:00+04:00",
            },
            {
                label: "electricity",
                amount: 474,
                paidBy: "khalid",
                createdAt: "2024-02-23T00:00:00+04:00",
            },
            { label: "fatima", amount: 600, paidBy: "wisam" },
            {
                label: "rent",
                amount: 5250,
                paidBy: "khalid",
                createdAt: "2024-02-23T00:00:00+04:00",
            },
            { label: "meow fund", amount: 180, paidBy: "wisam" },
            {
                label: "mama ",
                amount: 700,
                paidBy: "wisam",
                createdAt: "2024-02-23T00:00:00+04:00",
            },
        ],
        contributors: ["wisam", "khalid"],
        status: "completed",
        createdAt: "2024-02-23T00:00:00+04:00",
    },
    {
        title: "bil3",
        billDate: "2024-03-23T00:00:00+04:00",
        expenses: [
            {
                label: "elife",
                amount: 375,
                paidBy: "khalid",
                createdAt: "2024-03-23T00:00:00+04:00",
            },
            {
                label: "electricity",
                amount: 415,
                paidBy: "khalid",
                createdAt: "2024-03-23T00:00:00+04:00",
            },
            { label: "fatima", amount: 600, paidBy: "wisam" },
            {
                label: "rent",
                amount: 5250,
                paidBy: "khalid",
                createdAt: "2024-03-23T00:00:00+04:00",
            },
            { label: "meow fund", amount: 90, paidBy: "wisam" },
            {
                label: "mama fees",
                amount: 500,
                paidBy: "khalid",
                createdAt: "2024-03-23T00:00:00+04:00",
            },
        ],
        contributors: ["wisam", "khalid"],
        status: "completed",
        createdAt: "2024-03-23T00:00:00+04:00",
    },
];

const HistoryList = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetch("/api/bill").then((response) => {
            response.json().then((data) => {
                setHistory(thelistedBillJson);
            });
        });
    }, []);

    const getTotals = (expenses) => {
        let total = 0;
        expenses.forEach((expense) => {
            total += expense.amount;
        });
        return total;
    };

    return (
        <>
            <div className="header container mx-auto px-6 py-4 gap-2 mb-5">
                <Image
                    src="/icons/calendar.svg"
                    alt="home"
                    width={25}
                    height={25}
                />
                <h1>History</h1>
            </div>
            <div className="container mx-auto px-6 py-4">
                {history.reverse().map((item, index) => (
                    <div className="item" key={item.billDate}>
                        <div className="date">
                            <Image
                                src="/icons/cash.svg"
                                alt="cash"
                                width={25}
                                height={25}
                            />{" "}
                            {moment(item.billDate).format("MMM DD, YYYY")}
                        </div>
                        <div className="totalAmount">
                            {getTotals(item.expenses)} AED
                        </div>
                    </div>
                ))}
            </div>
            <BottomNavigation />
        </>
    );
};

export default HistoryList;
