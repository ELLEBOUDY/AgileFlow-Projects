import { useEffect, useState, useCallback } from "react";
import { userAPI } from "../services/api";

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: "admin" | "manager" | "member";
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setUser(null);
                setError(null);
                return;
            }

            setLoading(true);
            const response = await userAPI.getCurrentUser();
            setUser(response.data);
            setError(null);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch user data";
            setError(errorMessage);
            setUser(null);
            console.error("Error fetching user:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    if (isMounted) {
                        setUser(null);
                        setError(null);
                    }
                    return;
                }

                if (isMounted) setLoading(true);
                const response = await userAPI.getCurrentUser();
                if (isMounted) {
                    setUser(response.data);
                    setError(null);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    const errorMessage = err instanceof Error ? err.message : "Failed to fetch user data";
                    setError(errorMessage);
                    setUser(null);
                    console.error("Error fetching user:", err);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { user, loading, error, refetch: fetchUser };
}
