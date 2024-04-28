import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    useRef,
    useEffect,
} from "react";

enum Level {
    success = "bg-green-700",
    error = "bg-red-800",
    info = "bg-blue-500",
}

const SnackNotification = forwardRef((props, ref) => {
    const [showNotification, setShowNotification] = useState(false);
    const [levelState, setLevelState] = useState(Level.info);
    const [msgState, setMsgState] = useState("");
    const timerRef = useRef(null);

    type levelType = "success" | "error" | "info";
    const open = (mesasge: string, level: levelType) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setLevelState(Level[level] || Level.info);
        setMsgState(mesasge);

        setShowNotification(true);
        timerRef.current = setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    useImperativeHandle(ref, () => ({
        open: open,
    }));

    const clx = `fixed bottom-5 right-5 ${levelState} text-white px-4 py-2 rounded shadow ${
        showNotification ? "opacity-100" : "opacity-0"
    } transition-opacity duration-300`;

    return <div className={clx}>{msgState}</div>;
});

SnackNotification.displayName = "SnackNotification";

export default SnackNotification;
