import SnackNotification from "@/components/SnackNotification";
import React, { FormEvent, useRef, useState } from "react";

const Login = () => {
    const snackRef = useRef(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        snackRef.current.open("Hello", "error");
        // const formData = new FormData(e.currentTarget);
        // const username = formData.get("username");
        // const password = formData.get("password");

        // try {
        //     const response = await fetch(
        //         "http://localhost:3000/api/user/authenticate",
        //         {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify({ userName: username, password }),
        //         }
        //     );

        //     if (response.ok) {
        //         // Handle successful authentication
        //         console.log("Login successful!");
        //     } else {
        //         // Handle authentication failure
        //         console.error("Login failed");
        //     }
        // } catch (error) {
        //     console.error("An error occurred while logging in:", error);
        // }
    };

    return (
        <div className="flex justify-center items-center h-screen px-8">
            <div className="rounded-lg p-8 max-w-md w-full shadow-lg bg-gray-900">
                <h2 className="text-2xl text-center font-semibold mb-4">
                    Login
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-1">
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
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
                            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600"
                    >
                        Enter
                    </button>
                </form>
                <SnackNotification ref={snackRef} />
            </div>
        </div>
    );
};

export default Login;
