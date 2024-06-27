import { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { useDb } from "@/hoc/DbProvider";
import * as jose from "jose";
import { NextComponentType } from "next";
import { useSnackNotification } from "@/hoc/SnackNotificationProvider";

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P> | NextComponentType<P>
) => {
  const Wrapper = (props: P) => {
    const router = useRouter();
    const db = useDb();
    const { open } = useSnackNotification();
    const [isLoading, setIsLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const isLoginPage = router.pathname === "/login";

    useEffect(() => {
      // Authentication logic
      const isAuthenticated = async (): Promise<boolean> => {
        const sessionToken = localStorage.getItem("session-token");
        if (!sessionToken) return false;

        try {
          const { payload } = await jose.jwtVerify(
            sessionToken,
            new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
          );

          const userId = payload?.userId;

          if (typeof userId !== "string") return false;

          const user = await db.userCollection.getUserById(userId);

          if (!user) return false;

          // all checks passed. TODO: session exp validation
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      };

      const checkAuthentication = async () => {
        try {
          const auth = await isAuthenticated();
          setAuthenticated(auth);
          if (!auth && !isLoginPage) {
            router.push("/login").then((isSuccess) => {
              if (isSuccess) setIsLoading(false);
            });
            return;
          }

          if (auth && isLoginPage) {
            router.push("/").then((isSuccess) => {
              if (isSuccess) setIsLoading(false);
            });
            return;
          }
          setIsLoading(false);
        } catch {
          open("Error Authenticating", "error");
          setIsLoading(false);
        }
      };

      checkAuthentication();
    }, [router, db, isLoginPage, open]);

    if (isLoading) {
      return <Loader />;
    }

    if (!authenticated && !isLoginPage) {
      return <Loader />;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
