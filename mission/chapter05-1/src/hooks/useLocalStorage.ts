import { useState, useEffect, useCallback } from "react";

export const useLocalStorage = <T>(key: string, initialValue?: T) => {

    const [storedValue, setStoredValue] = useState<T | null>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : (initialValue ?? null);
        } catch (error) {
            console.error(error);
            return initialValue ?? null;
        }
    });

    const setItem = useCallback((value: T) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            setStoredValue(value);
        } catch (error) {
            console.error(error);
        }
    }, [key]);
    const getItem = useCallback(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [key]);

    const removeItem = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(null);
        } catch (error) {
            console.error(error);
        }
    }, [key]);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {

            if (event.key === key && event.storageArea === localStorage) {
                try {
                    const newValue = event.newValue ? JSON.parse(event.newValue) : null;
                    setStoredValue(newValue);
                } catch (error) {
                    console.error("Storage event parsing error:", error);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => window.removeEventListener("storage", handleStorageChange);
    }, [key]);

    return { value: storedValue, setItem, getItem, removeItem };
};