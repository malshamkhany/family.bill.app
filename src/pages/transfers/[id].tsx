import ButtonLoader from "@/components/ButtonLoader";
import DotStatus from "@/components/DotStatus";
import Loader from "@/components/Loader";
import BottomNavigation from "@/components/bottomNavigation";
import {
  getBillContributionIdByUserId,
  getAmountTrasferredTo,
} from "@/helpers";
import { useSnackNotification } from "@/hoc/SnackNotificationProvider";
import { useUser } from "@/hoc/UserProvider";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

export default function Transfer() {
  const router = useRouter();
  const { user } = useUser();
  const { open } = useSnackNotification();
  const [billData, setBillData] = useState(null);
  const [contributorsDetail, setContributorsDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.query.id) {
      fetch(`/api/bill?id=${router.query.id}`)
        .then((response) => {
          response.json().then(({ data, success }) => {
            if (success) setBillData(data);
            else open("bill not found", "error");
          });
        })
        .catch(() => open("bill not found", "error"));
    }
  }, [router.query.id, open]);

  useEffect(() => {
    if (billData) {
      const billContributionId = getBillContributionIdByUserId(
        billData.contributors,
        user._id
      );

      fetch(`/api/billContributor?id=${billContributionId}`)
        .then((response) => {
          response.json().then(({ data, success }) => {
            if (success) setContributorsDetail(data);
            else open("contributor bill not found", "error");
          });
        })
        .catch(() => open("contributor bill not found", "error"));
    }
  }, [billData, user, open]);

  if (!billData || !contributorsDetail) {
    return <Loader />;
  }

  //filter contributors other than self
  const contributors = billData.contributors.filter(
    (bc) => bc.userId !== user._id
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const transfers = [
      ...contributors.map((c: any) => {
        // to no edit transfer date if amount has not being modified
        const unchanged = isFieldNotDirty(
          contributorsDetail.transfers,
          user._id,
          c.userId,
          parseFloat(formData.get(c.userId).toString())
        );

        return {
          from: user._id,
          to: c.userId,
          amount: parseFloat(formData.get(c.userId).toString()),
          transferDate:
            unchanged === undefined ? new Date() : unchanged.transferDate,
        };
      }),
    ];

    // const hasSettled = formData.get("hasSettled") === "on";
    // const settlementData = hasSettled
    //     ? { hasSettled, settlementDate: new Date() }
    //     : { hasSettled, settlementDate: "" };

    fetch("/api/billContributor", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...contributorsDetail,
        transfers: transfers.filter((c) => c.amount !== 0),
        // ...settlementData,
      }),
    })
      .then((response) => {
        response.json().then(({ data, success }) => {
          if (success) open("Transfer updated", "success");
          else open("Error: could not update", "error");
        });
      })
      .catch(() => open("Error: could not update", "error"))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="header container mx-auto px-6 py-4 gap-2">
          <Image
            src="/icons/transfer.svg"
            alt="transfers"
            width={25}
            height={25}
          />
          <h1>Transfer</h1>
        </div>

        <div className="px-4">
          <div className="flex justify-between items-center my-5">
            <div className="capitalize">
              Bill for:{" "}
              <span className="font-bold underline">
                {" "}
                {moment(billData.billDate).format("MMM DD, YYYY")}
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-2">
              Status: <DotStatus status={billData.status} />
            </div>
          </div>

          <div className="capitalize text-xl mb-2">
            Update your transfers to
          </div>

          <form onSubmit={handleSubmit}>
            {contributors.map((c) => (
              <div key={c.userId}>
                <TextTransferInput
                  className="input"
                  name={c.userId}
                  defaultValue={getAmountTrasferredTo(
                    contributorsDetail?.transfers,
                    c.userId
                  )}
                  placeholder={c.userName}
                />
              </div>
            ))}

            {/* <div className="mt-4 flex items-center gap-x-4">
                            <input
                                type="checkbox"
                                className="w-6 h-6"
                                name="hasSettled"
                            />
                            <div className="text-md">Mark as settled</div>
                        </div> */}

            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className="bg-[#39ace7]"
                disabled={billData.status !== "pending" || loading}
                style={{
                  filter: `grayscale(${
                    loading || billData.status !== "pending" ? "1" : "0"
                  })`,
                  color: "#fff",
                  transition: "0.4s all ease",
                }}
              >
                {loading ? (
                  <ButtonLoader className="h-6 w-[3.6rem] scale-50" />
                ) : (
                  "Update"
                )}
                {/* Update */}
              </button>
            </div>
          </form>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}

const TextTransferInput = (props) => {
  return (
    <div className="w-full">
      <p className="mb-1">{props.placeholder}:</p>
      <input type="number" step=".001" {...props} />
    </div>
  );
};

const isFieldNotDirty = (
  transfers: any = [],
  from: string,
  to: string,
  amount: number
) => {
  return transfers.find(
    (t: any) => t.to === to && t.from === from && t.amount === amount
  );
};
