import React, { useState, useEffect } from "react";
import { Bill } from "@/api/models/bill";
import AddBill from "./Old_add";
import { useUser } from "@/hoc/UserProvider";

const EditBill = () => {
    const [bill, setBill] = useState<Bill>(null);
    const { user } = useUser();

    useEffect(() => {
        fetch("/api/bill/current").then((response) => {
            response.json().then(({ data, success }) => {
                setBill(data);
            });
        });
    }, []);

    return (
        <AddBill
            mode="edit"
            billToEdit={{
                ...bill,
                expenses: bill?.expenses.map((j) => {
                    return { ...j, value: j.amount };
                }),
            }}
        />
    );
};

export default EditBill;
