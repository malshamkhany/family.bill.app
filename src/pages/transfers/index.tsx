import DotStatus from "@/components/DotStatus";
import Loader from "@/components/Loader";
import BottomNavigation from "@/components/bottomNavigation";
import { useDb } from "@/hoc/DbProvider";
import withAuth from "@/hoc/withAuth";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Transfers() {
  const router = useRouter();
  const db = useDb()
  const [data, setData] = useState([]);

  useEffect(() => {
    db.billCollection
      .readBills({}, { sort: { createdAt: -1 } })
      .then((data) => setData(data))
      .catch(() => {
        open("Something went wrong.", "error");
      });
  }, [db.billCollection]);

  const handleSelectBill = (id: string) => {
    router.push(`/transfers/${id}`, { scroll: false });
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
          <h1>Transfers</h1>
        </div>

        <div className="px-2 h-[65vh] overflow-scroll mt-10">
          <div className="capitalize text-center mb-2">Select a Bill</div>
          {!data?.length ? (
            <Loader />
          ) : (
            <BillListComponent data={data} OnItemSelect={handleSelectBill} />
          )}
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}

const BillListComponent = ({ data, OnItemSelect }) => {
  const handleSelect = (id) => {
    OnItemSelect(id);
  };
  return (
    <ul className="bg-[#192428] rounded-lg shadow-lg px-2">
      {data.map((item) => (
        <li
          key={item._id}
          onClick={() => handleSelect(item._id)}
          className="border-b border-gray-700 last:border-none p-4 hover:bg-gray-700 transition-colors duration-200"
        >
          <div className="text-gray-300 flex justify-between">
            <div className="flex  justify-center items-center gap-x-2">
              <div className="flex items-center justify-center gap-x-2">
                <DotStatus status={item.status} />
                <div className="capitalize">{item.status}</div>
              </div>

              {" | "}
              <div className="flex gap-x-2">
                <Image
                  src="/icons/calendar.svg"
                  alt="calendar"
                  width={25}
                  height={25}
                />
                {moment(item.billDate).format("MMM DD, YYYY")}
              </div>
            </div>
            <div className="flex gap-x-2">
              <button className="border border-white rounded-md capitalize p-2">
                <Image
                  src="/icons/transfer.svg"
                  alt="transfer"
                  width={25}
                  height={25}
                />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};


export default withAuth(Transfers);