import React from "react";

const statusStyles = {
    pending: "bg-yellow-500",
    settled: "bg-green-500",
    // Additional statuses can be added here
};
type Status = "pending" | "settled";

const DotStatus = ({ status }: { status: Status }) => {
    const statusClass = statusStyles[status] || "bg-gray-500"; // Default to gray if status is not recognized

    return <div className={`w-3 h-3 rounded-full ${statusClass}`}></div>;
};

export default DotStatus;
