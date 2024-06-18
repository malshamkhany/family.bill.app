import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const BottomNavigation = () => {
    const router = useRouter();

    return (
        <nav className="bottomNavigation">
            <Link
                href="/"
                passHref
                className={router.pathname === "/" ? "active" : ""}
            >
                <Image
                    src="/icons/home.svg"
                    alt="home"
                    width={20}
                    height={20}
                />
                Home
            </Link>
            <Link
                href="/history"
                passHref
                className={router.pathname === "/history" ? "active" : ""}
            >
                <Image
                
                    src="/icons/calendar.svg"
                    alt="calendar"
                    width={20}
                    height={20}
                />
                History
            </Link>
            <Link
                href="/transfers"
                passHref
                className={router.pathname === "/transfers" ? "active" : ""}
            >
                <Image
                    src="/icons/transfer.svg"
                    alt="cash"
                    width={20}
                    height={20}
                />
                Transfers
            </Link>
            <Link
                href="/bill/new"
                passHref
                className={router.pathname === "/add" ? "active" : ""}
            >
                <Image src="/icons/plus.svg" alt="add" width={20} height={20} />
                Add New
            </Link>
        </nav>
    );
};

export default BottomNavigation;
