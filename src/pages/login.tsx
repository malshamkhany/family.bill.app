// import SnackNotification from "@/components/SnackNotification";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { useUser } from "@/hoc/UserProvider";
import { useSnackNotification } from "@/hoc/SnackNotificationProvider";
import Image from "next/image";
import ButtonLoader from "@/components/ButtonLoader";
import { useDb } from "@/hoc/DbProvider";
import withAuth from "@/hoc/withAuth";

const Login = () => {
  const router = useRouter();
  const db = useDb();
  const [loading, setLoading] = useState(false);
  const { open } = useSnackNotification();

  const { onLogin } = useUser();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString();
    const password = formData.get("password");

    try {
      const user = await db.userCollection.getUserByUserName(username);

      if (!user?._id || password !== process.env.NEXT_PUBLIC_USER_PASSWORD) {
        open("Wrong username or password", "error");
        setLoading(false);
        return;
      }

      onLogin({ _id: user._id.toString(), userName: user.userName });
      open("Login successful", "success");
      router.push("/", { scroll: false });
    } catch (error) {
      open("Login failed", "error");
      console.error("An error occurred while logging in:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center h-screen px-8 mt-[5vh]">
      <Image
        className="aspect-square object-cover rounded-[6rem] mb-8"
        width={200}
        height={200}
        alt="soksok"
        src="/images/soksok.jpg"
      />

      <div className="rounded-lg p-8 max-w-md w-full shadow-lg bg-[#414c50]">
        <h2 className="text-2xl text-center font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 ">
            <label htmlFor="username" className="block mb-1">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:border-blue-500 text-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ filter: `grayscale(${loading ? "1" : "0"})` }}
            className="w-full bg-[#0784b5] text-white py-2 rounded-md mt-4 hover:bg-blue-600"
          >
            {loading ? <ButtonLoader className="h-6 scale-50" /> : "Enter"}
          </button>
        </form>
        {/* <SnackNotification ref={snackRef} /> */}
      </div>
    </div>
  );
};

export default withAuth(Login);
