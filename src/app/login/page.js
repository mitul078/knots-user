"use client";
import React, { useState } from "react";
import "./style.scss";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getMeThunk, loginUserThunk } from "../../store/slice/user/user.thunk";
const LoginPage = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const {  register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const dispatch = useDispatch()
    const submitHandler = async (data) => {
        setLoading(true)
        try {
            await dispatch(loginUserThunk(data)).unwrap()
            await dispatch(getMeThunk()).unwrap()
            console.log(getMeThunk())
            toast.success("Login Successfully")
            router.push("/")
        } catch (error) {
            toast.error(error || "Login failed")
        }  finally{
            setLoading(false)
        }
    };

    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleGoogleSignIn = () => {
        window.location.href = "http://localhost:3000/api/auth/google"
    };

    const goToSignup = () => {
        router.push("/register")
    };

    return (
        <div className="login-container">
            <h2>Login</h2>

            <form onSubmit={handleSubmit(submitHandler)}>
                <div className="input-group">
                    <label>Username or email</label>
                    <input
                        {...register("identifier", { required: true })}
                        type="text"
                        placeholder="Enter username or email"
                    />
                </div>

                <div className="input-group password-wrapper">
                    <label>Password</label>
                    <input
                        {...register("password", { required: true })}
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter password"
                    />
                    <span className="toggle-password" onClick={togglePassword}>
                        {passwordVisible ? "Hide" : "Show"}
                    </span>
                </div>

                <button type="submit" className="btn">
                    {loading ? "Sign in..." : "Sign In"}
                </button>
            </form>

            <button className="btn btn-google" onClick={handleGoogleSignIn}>
                Sign in with Google
            </button>

            <span className="link" onClick={goToSignup}>
                Don&apos;t have an account? Sign Up
            </span>
        </div>
    );
};

export default LoginPage;
