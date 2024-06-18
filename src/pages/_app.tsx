import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@/hoc/UserProvider";
import SnackNotificationProvider from "@/hoc/SnackNotificationProvider";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SnackNotificationProvider>
            <UserProvider>
                <Component {...pageProps} />
            </UserProvider>
        </SnackNotificationProvider>
    );
}
