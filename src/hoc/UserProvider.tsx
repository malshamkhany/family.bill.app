// UserContext.tsx

import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from "react";

interface User {
    _id: string;
    userName: string;
}

interface UserContextType {
    user: User | null;
    onLogin: (userData: { userName: string; _id: string }) => void;
    onLogout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

const UserProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const onLogin = (userData: { userName: string; _id: string }) => {
        const { _id, userName } = userData;
        const user = { _id, userName };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
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
