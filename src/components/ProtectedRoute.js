"use client";
import axios from "../lib/axiosConfig";
import { setUser } from "../store/slice/user/user.slice"; // adjust path to your slice
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./loadingSpinner/Loading";
export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initUser = async () => {
            try {
                const res = await axios.get("/api/auth/me", { withCredentials: true });
                if (res.status === 200 && res.data?.user) {
                    dispatch(setUser(res.data.user));
                } else {
                    router.push("/login");
                }

            } catch (err) {
                router.push("/login");
            } finally {
                setTimeout(() => {
                    setLoading(false)
                } , 500)
            }
        };

        if (!user) {
            initUser();
        } else {
            setTimeout(() => {
                setLoading(false)
            },500)
        }
    }, [user, dispatch, router]);

    if (loading) {
        return <Loading />;
    }

    return children;
}
