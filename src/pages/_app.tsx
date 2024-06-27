import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@/hoc/UserProvider";
import SnackNotificationProvider from "@/hoc/SnackNotificationProvider";
import { DbProvider } from "@/hoc/DbProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SnackNotificationProvider>
      <DbProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </DbProvider>
    </SnackNotificationProvider>
  );
}
