import ButtonLoader from "@/components/ButtonLoader";
import Loader from "@/components/Loader";
import BottomNavigation from "@/components/bottomNavigation";
import MongoDbContext from "@/db/mongodb";
import { useDb } from "@/hoc/DbProvider";
import { useSnackNotification } from "@/hoc/SnackNotificationProvider";
import { useUser } from "@/hoc/UserProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { BSON } from "realm-web";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { CheckBox } from "@/components/CheckBox";

const BillPage = () => {
  const router = useRouter();
  const db = useDb();
  const routeParams = router.query;

  const { user } = useUser();

  const [billState, setBillState] = useState<Bill>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { open } = useSnackNotification();

  const methods = useForm({
    mode: "onChange",
    defaultValues: { ...newBill },
    resolver: zodResolver(BillSchema),
  });
  const { reset, control, watch, formState, setValue, getValues } = methods;
  const { isDirty, isValid, dirtyFields } = formState;
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "expenses", // unique name for your Field Array
  });

  const watchedExpensed = watch("expenses");
  const billDateState = watch("billDate");

  const [showMore, setShowmore] = useState({
    value: "",
    show: false,
  });

  useEffect(() => {
    function updateBillState() {
      const { billId } = routeParams;

      if (billId === "new") {
        setBillState(newBill);
        setLoading(false);
      } else {
        db.billCollection
          .getBillById(billId as string)
          .then((data) => {
            setBillState(data);
            setLoading(false);
          })
          .catch(() =>
            open("Error: failed to get bill" + `id: ${billId}`, "error")
          );
      }
    }

    if (routeParams.billId) updateBillState();
  }, [open, routeParams, db.billCollection]);

  useEffect(() => {
    if (!billState) {
      return;
    }

    reset(billState);
  }, [billState, reset]);

  useEffect(() => {
    return () => {
      setBillState(null);
      setLoading(true);
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  const defaultExpenses = [
    { label: "eLife", amount: 375 },
    { label: "Electricity", amount: 600 },
    { label: "Meow Fund", amount: 250 },
    { label: "Fatima", amount: 600 },
    { label: "Rent", amount: 5250 },
  ];

  const HandleAddMore = () => {
    let p = { ...showMore, show: true };
    setShowmore(p);
  };
  const HandleRemoveMore = () => {
    let p = { ...showMore, show: false };
    setShowmore(p);
  };

  const handleAddExpense = (expense = null) => {
    if (expense != null) {
      append(newExpense(expense.label, user.userName, expense.amount));
      return;
    }

    append(newExpense(showMore.value, user.userName));

    let p = { ...showMore, show: false, value: "" };
    setShowmore(p);
  };

  const sumOfValues: number = watchedExpensed.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  const isDisabled = !isDirty || !isValid;

  function handleCreateBill(): void {
    setUpdating(true);
    postBill(getValues(), db)
      .then(() => {
        open("Bill created.", "success");
        router.push("/");
      })
      .catch((e) => {
        open("Failed to create bill.", "error");
        console.log(e);
      })
      .finally(() => setUpdating(false));
  }

  function handleUpdateBill(): void {
    setUpdating(true);
    const billToUpdate: any = {
      ...getValues(),
      lastUpdated: new Date(),
      lastUpdatedBy: user.userName,
      totalAmount: sumOfValues,
    };

    db.billCollection
      .updateBill({ _id: billToUpdate._id }, { $set: { ...billToUpdate } })
      .then(() => {
        open("Bill updated.", "success");
        reset(billToUpdate);
      })
      .catch((e) => {
        open("Failed to update bill.", "error");
        console.log(e);
      })
      .finally(() => setUpdating(false));
  }

  return (
    <>
      <div className="header container mx-auto px-6 py-4 gap-2 ">
        <div className="flex w-full justify-between px-2">
          <h1>{routeParams?.billId === "new" ? "Add" : "Edit"} bill</h1>
          <div className="flex">
            <div className="decoration-white underline mr-2">
              {routeParams.billId === "new"
                ? moment(billDateState).format("MMM DD, YYYY")
                : moment(billState.billDate).format("MMM DD, YYYY")}
            </div>
            <Image
              src="/icons/calendar.svg"
              alt="calendar"
              className="aspect-square"
              width={25}
              height={25}
              style={{ width: 25, height: 25 }}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 pt-4">
        <div className="flex flex-wrap gap-2">
          {defaultExpenses
            .filter((d) => !fields.some((a) => a.label === d.label))
            .map((expense, idx) => (
              <div
                key={expense.label}
                onClick={() => handleAddExpense(expense)}
              >
                {pillButton(expense.label)}
              </div>
            ))}
          <div onClick={() => HandleAddMore()}>{pillButton("Add more")}</div>
        </div>
        {showMore.show && (
          <p className="mb-1 text-xl pt-4">What would you like to add?</p>
        )}
        {showMore.show && (
          <div className="flex items-center gap-4">
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
              onClick={() => handleAddExpense()}
            >
              Add
            </button>

            <Image
              src="/icons/trash.svg"
              alt="bin"
              width={30}
              height={30}
              onClick={HandleRemoveMore}
            />
          </div>
        )}
        <div className="bg-white h-[1px] w-full my-4" />
      </div>
      <div className="container mx-auto px-6 py-4">
        {fields.length === 0 && (
          <div className="mt-[-1rem] mb-2">
            Press <span className="underline underline-offset-4">Add more</span>{" "}
            or any of the quick add bubbles to add an expense.{" "}
          </div>
        )}
        <div className="grid grid-cols-1 gap-x-4">
          {fields
            // .filter((f) => f.paidBy === user.userName)
            .map((expense, idx) => (
              <div key={idx} className="flex items-center gap-2 justify-center">
                <Controller
                  name={`expenses.${idx}.amount`}
                  control={control}
                  render={({ field: { onChange, ...rest } }) => (
                    <>
                      <div className="w-full">
                        <p className="mb-1">
                          {expense.label}{" "}
                          {expense.paidBy !== user.userName &&
                            `- By ${expense.paidBy}`}
                        </p>
                        <input
                          {...rest}
                          readOnly={expense.paidBy !== user.userName}
                          className="input"
                          style={{
                            backgroundColor:
                              expense.paidBy !== user.userName
                                ? "#aeaeae"
                                : "white",
                          }}
                          onChange={(e) =>
                            setValue(
                              `expenses.${idx}.amount`,
                              parseFloat(e.target.value),
                              { shouldDirty: true }
                            )
                          }
                          type="number"
                        />
                      </div>

                      <Image
                        src={
                          expense.paidBy === user.userName
                            ? "/icons/trash.svg"
                            : "/icons/trash_disabled.svg"
                        }
                        alt="bin"
                        className={`mt-4 p-1 w-12 aspect-square  ${
                          expense.paidBy === user.userName &&
                          "cursor-pointer hover:bg-[#ffffff11]"
                        } rounded-lg`}
                        width={30}
                        height={30}
                        onClick={() =>
                          expense.paidBy === user.userName ? remove(idx) : null
                        }
                      />
                    </>
                  )}
                />
              </div>
            ))}
        </div>

        <div className="my-3 border-white border-b-2" />

        <div className="w-full">
          <p className="mb-1">
            {routeParams.billId === "new"
              ? "Select bill date"
              : "Change bill date"}
          </p>
          <Controller
            name="billDate"
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <input
                {...rest}
                type="date"
                value={value ? moment(value).format("YYYY-MM-DD") : ""}
                onChange={(e) => {
                  const date = moment(e.target.value, "YYYY-MM-DD", true);
                  if (date.isValid()) {
                    onChange(date.toDate());
                  }
                }}
                className="w-full p-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>

        <div className="flex justify-center mt-4">
          <Controller
            name="contributors"
            control={control}
            render={({ field: { value, onChange } }) => (
              <>
                {value.map((c, idx) => {
                  if (c.userName === user.userName) {
                    return (
                      <CheckBox
                        checked={c.isSettled}
                        key="checkbox-settle"
                        label={"No more expenses to add"}
                        onChange={(e) => {
                          let valToUpdate = [...value];
                          valToUpdate[idx].isSettled = e.target.checked;
                          valToUpdate[idx].settledDate = new Date();
                          onChange(valToUpdate);
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </>
            )}
          />
        </div>

        <div className="text-center pt-8">
          <div className="totalAmount">
            {fields.length !== 0 && (
              <>
                <strong>Total amount:</strong>{" "}
                {isNaN(sumOfValues) ? "0" : sumOfValues?.toFixed(2)}{" "}
                <small>AED</small>
              </>
            )}
          </div>
          <div className="createBillButton">
            <button
              disabled={isDisabled || updating}
              className="bg-[#39ace7]"
              onClick={() =>
                routeParams.billId === "new"
                  ? handleCreateBill()
                  : handleUpdateBill()
              }
              style={{
                filter: `grayscale(${updating || isDisabled ? "1" : "0"})`,
                color: "#fff",
                transition: "0.4s all ease",
              }}
            >
              {updating ? (
                <ButtonLoader className="h-6 w-20 scale-50" />
              ) : routeParams.billId !== "new" ? (
                "Update to bill"
              ) : (
                "Add to bill"
              )}
            </button>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
};

export default BillPage;

// defs
const pillButton = (label: string) => {
  return (
    <button
      className={
        (label !== "Add more"
          ? "bg-[#39ace7] hover:bg-blue-700 text-white"
          : "bg-white hover:bg-gray-100 text-gray-800 ") +
        "font-bold py-2 px-4 rounded-full"
      }
    >
      {label}
    </button>
  );
};

const BillSchema = z.object({
  title: z.string(),
  billDate: z.date(),
  expenses: z.array(
    z.object({
      label: z.string(),
      amount: z.number().positive(),
      paidBy: z.string().nullable().optional(),
      createdAt: z.date(),
    })
  ),
  status: z.string(),
  contributors: z
    .array(
      z
        .object({
          billContributionId: z.string(),
          userId: z.string(),
          userName: z.string(),
          isSettled: z.boolean(),
          settledDate: z.date(),
        })
        .optional()
    )
    .optional(),
});

// extract the inferred type
export type Bill = z.infer<typeof BillSchema>;

const newBill: Bill = {
  billDate: new Date(),
  expenses: [],
  status: "pending",
  title: "bill",
  contributors: [],
};

const newExpense = (label: string, paidBy: string, amount = 0) => {
  return {
    amount,
    createdAt: new Date(),
    label,
    paidBy,
  };
};

const postBill = async (bill: any, db: MongoDbContext) => {
  let totalAmount = 0;
  bill.expenses.forEach((a) => (totalAmount += a.amount));
  bill.totalAmount = totalAmount;

  // correct schema
  bill.createdAt = new Date();
  bill.lastUpdated = new Date();
  bill._id = new BSON.ObjectId();
  bill.contributors = [];

  let result = await db.billCollection.createBill(bill);

  // auto-add all contributors.
  // TODO: in future, have to user add contributors via api requests
  const users = await db.userCollection.readUsers();
  let contributorList = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const billContribution = {
      _id: new BSON.ObjectId(),
      billId: result.insertedId.toString(),
      transfers: [],
      userId: user._id.toString(),
      userName: user.userName,
    };
    const created = await db.billContributionCollection.createContributionBill(
      billContribution
    );
    if (created.insertedId) {
      contributorList = [
        ...contributorList,
        {
          billContributionId: created.insertedId.toString(),
          userId: billContribution.userId,
          userName: billContribution.userName,
          isSettled: false,
          settledDate: new Date(),
        },
      ];
    } else console.log("failed to create contributor");
  }

  if (contributorList.length > 0) {
    await db.billCollection.updateBill(
      { _id: result.insertedId },
      { $set: { contributors: contributorList, lastUpdated: new Date() } }
    );
  }

  if (result) return result;

  return null;
};
