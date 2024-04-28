import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import BottomNavigation from "@/components/bottomNavigation";

interface Expense {
    label: string;
    value: number;
}

const TextBillInput = (props) => {
    return (
        <div className="w-full">
            <p className="mb-1">{props.placeholder}:</p>
            <input type="number" {...props} />
        </div>
    );
};

const AddBill = () => {
    const [expenses, setExpenses] = useState([]);
    const [showMore, setShowmore] = useState({
        value: "",
        show: false,
    });

    const handleCreateBill = async () => {
        try {
        } catch (error) {
            console.error("Error storing bill data: ", error);
        }
    };

    const defaultExpenses: Expense[] = [
        { label: "Elife", value: 375 },
        { label: "Electricity Bill", value: 600 },
        { label: "Meow Fund", value: 250 },
        { label: "Fatima", value: 600 },
        { label: "Rent", value: 5250 },
    ];

    function filterArray(array1: any[], array2: any[]) {
        return array1.filter(
            (item1: { label: string; defaultValue: number }) =>
                !array2.some(
                    (item2: { label: string; defaultValue: number }) =>
                        item1.label === item2.label &&
                        item1.defaultValue === item2.defaultValue
                )
        );
    }

    const filteredArray = filterArray(defaultExpenses, expenses);

    const sumOfValues: number = expenses.reduce(
        (acc, curr) => acc + parseFloat(curr.value),
        0
    );

    const pillButton = (label: string) => {
        return (
            <button
                className={
                    (label !== "+ Add more"
                        ? "bg-[#39ace7] hover:bg-blue-700 text-white"
                        : "bg-white hover:bg-gray-100 text-gray-800 ") +
                    "font-bold py-2 px-4 rounded-full"
                }
            >
                {label}
            </button>
        );
    };

    const HandleAddMore = () => {
        let p = { ...showMore, show: true };
        setShowmore(p);
    };

    const HandleRemoveMore = () => {
        let p = { ...showMore, show: false };
        setShowmore(p);
    };

    const handleAddExpense = (expense: Expense) => {
        let p = { ...showMore, show: false };
        setShowmore(p);
        setExpenses((prev) => [...prev, expense]);
    };

    const removeItem = (labelToRemove: String) => {
        setExpenses((prevItems) =>
            prevItems.filter((item) => item.label !== labelToRemove)
        );
    };

    const handleChangeExpense = (e, index) => {
        let newArr = [...expenses];
        newArr[index].value = e.target.value;
        setExpenses(newArr);
    };

    return (
        <>
            <div className="header container mx-auto px-6 py-4 gap-2 ">
                <div className="flex w-full justify-between px-2">
                    <h1>Add bill</h1>
                    <div className="flex">
                        <div className="decoration-white underline mr-2">
                            set date
                        </div>
                        <Image
                            src="/icons/calendar.svg"
                            alt="calendar"
                            width={25}
                            height={25}
                        />
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-6 pt-4">
                <div className="flex flex-wrap gap-2">
                    {filteredArray.map((expense) => (
                        <div
                            key={expense.label}
                            onClick={() => handleAddExpense(expense)}
                        >
                            {pillButton(expense.label)}
                        </div>
                    ))}
                    <div onClick={() => HandleAddMore()}>
                        {pillButton("+ Add more")}
                    </div>
                </div>
                {showMore.show && (
                    <p className="mb-1 text-xl pt-4">
                        What would you like to add?
                    </p>
                )}
                {showMore.show && (
                    <div className="flex items-center gap-4">
                        <div className="w-full">
                            <input
                                type="text"
                                className="input"
                                style={{ margin: 0 }}
                                value={showMore.value}
                                onChange={(e) =>
                                    setShowmore({
                                        ...showMore,
                                        value: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <button
                            style={{
                                backgroundColor: "#39ace7",
                                color: "#fff",
                                transition: "0.4s all ease",
                                width: "100px",
                            }}
                            onClick={() =>
                                handleAddExpense({
                                    label: showMore.value,
                                    value: 0,
                                })
                            }
                        >
                            Add
                        </button>

                        <Image
                            src="/icons/trash.svg"
                            alt="bin"
                            width={30}
                            height={30}
                            onClick={() => HandleRemoveMore()}
                        />
                    </div>
                )}
                <div className="bg-white h-[1px] w-full my-4" />
            </div>

            <div className="container mx-auto px-6 py-4">
                <div className="grid grid-cols-1 gap-x-4">
                    {expenses.map((expense, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <TextBillInput
                                className="input"
                                value={expense.value}
                                onChange={(e) => handleChangeExpense(e, index)}
                                placeholder={expense.label}
                            />
                            <Image
                                src="/icons/trash.svg"
                                alt="bin"
                                className="pt-4"
                                width={30}
                                height={30}
                                onClick={() => removeItem(expense.label)}
                            />
                        </div>
                    ))}
                </div>
                <div className="text-center pt-8">
                    <div className="totalAmount">
                        {expenses.length !== 0 && (
                            <>
                                {" "}
                                <strong>Total amount:</strong>{" "}
                                {sumOfValues?.toFixed(2)} <small>AED</small>
                            </>
                        )}
                    </div>
                    <div className="createBillButton">
                        <button
                            disabled={expenses.length === 0}
                            onClick={handleCreateBill}
                            style={{
                                backgroundColor:
                                    expenses.length === 0 ? "gray" : "#39ace7",
                                color: "#fff",
                                transition: "0.4s all ease",
                            }}
                        >
                            Add bill
                        </button>
                    </div>
                </div>
            </div>
            <BottomNavigation />
        </>
    );
};

export default AddBill;
