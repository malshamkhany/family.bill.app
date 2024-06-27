// UserContext.tsx

import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from "react";
import * as jose from "jose";

interface User {
    _id: string;
    userName: string;
}

interface UserContextType {
    user: User | null;
    onLogin: (userData: User) => Promise<void>;
    onLogout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

const UserProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const onLogin = async (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        const jwtToken = await new jose.SignJWT({
            userId: userData._id,
            userName: userData.userName,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));
        
        localStorage.setItem("session-token", jwtToken)
    };

    const onLogout = () => {
        setUser(null);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, onLogin, onLogout }}>
            {children}
        </UserContext.Provider>
    );
};

const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export { UserContext, UserProvider, useUser };
