import React, {
    useState,
    useContext,
    createContext,
    useRef,
    ReactNode,
} from "react";

enum Level {
    success = "bg-green-700",
    error = "bg-red-800",
    info = "bg-blue-500",
}

type levelType = "success" | "error" | "info";

type SnackNotificationContextType = {
    open: (message: string, level: levelType) => void;
};

const SnackNotificationContext = createContext<
    SnackNotificationContextType | undefined
>(undefined);

export const useSnackNotification = () => {
    const context = useContext(SnackNotificationContext);
    if (context === undefined) {
        throw new Error(
            "useSnackNotification must be used within a SnackNotificationProvider"
        );
    }
    return context;
};

const SnackNotificationProvider = ({ children }: { children: ReactNode }) => {
    const [showNotification, setShowNotification] = useState(false);
    const [levelState, setLevelState] = useState(Level.info);
    const [msgState, setMsgState] = useState("");
    const timerRef = useRef<number | null>(null);

    const open = (message: string, level: levelType) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setLevelState(Level[level] || Level.info);
        setMsgState(message);

        setShowNotification(true);
        timerRef.current = window.setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    return (
        <SnackNotificationContext.Provider value={{ open }}>
            {children}
            <div
                className={`fixed bottom-[10%] right-[5%] ${levelState} text-white px-4 py-2 rounded shadow ${
                    showNotification ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
            >
                {msgState}
            </div>
        </SnackNotificationContext.Provider>
    );
};

export default SnackNotificationProvider;
