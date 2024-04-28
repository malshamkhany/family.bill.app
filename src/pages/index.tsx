import Image from "next/image";
import { Inter } from "next/font/google";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { FC, useState } from "react";
import Link from "next/link";
import listBill from "@/api/features/bill/listBills";
import { Bill } from "@/api/models/bill";
import axios from "axios";
import BottomNavigation from "@/components/bottomNavigation";

const inter = Inter({ subsets: ["latin"] });

type ConnectionStatus = {
    isConnected: boolean;
};

export const getServerSideProps: GetServerSideProps<
    ConnectionStatus
> = async () => {
    const bills = await listBill();
    return {
        props: { isConnected: true },
    };
};

export default function Home({
    isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [Bill, setBill] = useState<Bill>(null);

    const expenses = [
        { title: "Elife", amount: "375" },
        { title: "Electricity bill", amount: "566" },
        { title: "Fatima", amount: "600" },
        { title: "Rent", amount: "5250" },
        { title: "Meow Fund", amount: "250" },
        { title: "Other expenses", amount: "889" },
    ];

    const handleEdit = () => {
        // navigation.navigate("New", { expenses });]
        handleCreate();
    };

    const handleCreate = () => {
        const bill = {
            title: "bil1",
            billDate: new Date(),
            expenses: [
                { label: "rent", amount: 3000, createdAt: new Date() },
                { label: "fatima", amount: 500, createdAt: new Date() },
            ],
            contributors: [],
            status: "pending",
            totalAmount: 3500,
            createdAt: new Date(),
        };
        console.log("create call");
        axios
            .post("http://localhost:3000/api/bill", bill)
            .catch((e) => console.log(e));
    };

    return (
        <>
            <div className="header container mx-auto px-6 py-4 gap-2">
                <Image
                    src="/icons/home.svg"
                    alt="home"
                    width={25}
                    height={25}
                />
                <h1>Our Rent is Due</h1>
            </div>
            <div className="containerMain container mx-auto px-6">
                <div className="currentDue">
                    <span className="currentDueText">Current month:</span>
                    <Image
                        onClick={handleEdit}
                        className="cursor-pointer"
                        src="/icons/pencil.svg"
                        alt="edit"
                        width={25}
                        height={25}
                    />
                </div>

                <div className="dateItem">
                    <Image
                        src="/icons/calendar.svg"
                        alt="calendar"
                        width={25}
                        height={25}
                    />
                    <span className="expenseTitle">March - 03/2024 </span>
                </div>
                <div className="detailsRow">
                    <span className="expenseTitle">Details:</span>
                    <span className="expenseAmount">AED</span>
                </div>
                <div className="expensesContainer">
                    {expenses.map((expense, index) => (
                        <div className="expenseItem" key={index}>
                            <span className="expenseTitle">
                                {expense.title}
                            </span>
                            <span className="expenseAmount">
                                {expense.amount}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="amountDueContainer">
                    <div className="expenseItem">
                        <span className="expenseTitle">Total</span>
                        <span className="expenseAmount">{2643.33 * 3}</span>
                    </div>
                    <div className="expenseItem">
                        <span className="expenseTitle">Total (split by 3)</span>
                        <span className="expenseAmount">2643.33</span>
                    </div>
                </div>
            </div>
            <BottomNavigation />
        </>
    );
}
