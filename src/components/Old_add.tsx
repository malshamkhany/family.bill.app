import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import BottomNavigation from "@/components/bottomNavigation";
import moment from "moment";
import { useUser } from "@/hoc/UserProvider";
import { useRouter } from "next/navigation";

interface Expense {
    label: string;
    value: number;
    paidBy: String;
}

const TextBillInput = (props) => {
    return (
        <div className="w-full">
            <p className="mb-1">{props.placeholder}:</p>
            <input type="number" {...props} />
        </div>
    );
};

const AddBill = ({ mode = "add", billToEdit = null }) => {
    const [expenses, setExpenses] = useState([]);
    const [showMore, setShowmore] = useState({
        value: "",
        show: false,
    });
    const router = useRouter();
    const { user } = useUser();

    const handleUpdateBill = async () => {
        const currentTime = new Date().toISOString();

        console.log(user);

        const updatedExpense = [];

        expenses.forEach((expense) => {
            const editExp = billToEdit.expenses.find(
                (exp) =>
                    exp.label === expense.label && exp.paidBy === user.userName
            );

            if (editExp) {
                updatedExpense.push({
                    ...editExp,
                    amount: parseFloat(expense.value),
                });
            } else {
                updatedExpense.push({
                    label: expense.label,
                    amount: parseFloat(expense.value),
                    createdAt: currentTime,
                    paidBy: user.userName,
                });
            }
        });

        const payload = {
            ...billToEdit,
            expenses: updatedExpense,
        };

        console.log(payload);

        fetch("/api/bill/updateExpenses", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                return response.json();
            })
            .then((data) => {
                router.push("/");
                setExpenses([]);
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleCreateBill = async () => {
        const currentTime = new Date().toISOString();

        console.log(user);

        const payload = {
            title: "bil4",
            billDate: currentTime,
            expenses: expenses.map((expense) => ({
                label: expense.label,
                amount: parseFloat(expense.value),
                createdAt: currentTime,
                paidBy: user.userName,
            })),
            status: "pending",
            settlementDate: currentTime,
            createdAt: currentTime,
        };
        fetch("/api/bill", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setExpenses([]);
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    useEffect(() => {
        if (mode === "edit") {
            setExpenses(billToEdit.expenses || []);
        }
    }, [billToEdit, mode]);

    const defaultExpenses: Expense[] = [
        { label: "Elife", value: 375, paidBy: user?.userName },
        { label: "Electricity Bill", value: 600, paidBy: user?.userName },
        { label: "Meow Fund", value: 250, paidBy: user?.userName },
        { label: "Fatima", value: 600, paidBy: user?.userName },
        { label: "Rent", value: 5250, paidBy: user?.userName },
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
                    <h1>Add to bill</h1>
                    <div className="flex">
                        <div className="decoration-white underline mr-2">
                            {moment().format("MMM DD, YYYY")}
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
                    <form
                        className="flex items-center gap-4"
                        onSubmit={() =>
                            handleAddExpense({
                                label: showMore.value,
                                value: 0,
                                paidBy: user.userName,
                            })
                        }
                    >
                        <div className="w-full">
                            <input
                                type="text"
                                required
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
                            type="submit"
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
                    </form>
                )}
                <div className="bg-white h-[1px] w-full my-4" />
            </div>

            <div className="container mx-auto px-6 py-4">
                <div className="grid grid-cols-1 gap-x-4">
                    {expenses.map((expense, index) => {
                        if (expense.paidBy !== user.userName) {
                            return;
                        }
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-2 justify-center"
                            >
                                <TextBillInput
                                    className="input"
                                    value={expense.value}
                                    onChange={(e) =>
                                        handleChangeExpense(e, index)
                                    }
                                    placeholder={expense.label}
                                />
                                <Image
                                    src="/icons/trash.svg"
                                    alt="bin"
                                    className="mt-4 p-1 w-12 aspect-square cursor-pointer hover:bg-[#ffffff11] rounded-lg"
                                    width={30}
                                    height={30}
                                    onClick={() => removeItem(expense.label)}
                                />
                            </div>
                        );
                    })}
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
                            onClick={() =>
                                mode === "edit"
                                    ? handleUpdateBill()
                                    : handleCreateBill()
                            }
                            style={{
                                backgroundColor:
                                    expenses.length === 0 ? "gray" : "#39ace7",
                                color: "#fff",
                                transition: "0.4s all ease",
                            }}
                        >
                            {mode === "edit" ? "Update to bill" : "Add to bill"}
                        </button>
                    </div>
                </div>
            </div>
            <BottomNavigation />
        </>
    );
};

export default AddBill;
