"use client";
import React, { useState, useEffect } from "react";
import "./style.scss";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { registerUserThunk } from "../../store/slice/user/user.thunk";
const RegisterPage = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { reset, register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const dispatch = useDispatch()

    const submitHandler = async (data) => {
        setLoading(true)
        try {
            await dispatch(registerUserThunk(data)).unwrap()
            toast.success("Sign up successful!");
            router.push("/login")
            reset();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    };

    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    };


    const goToSignin = () => {
        router.push("/login")
    };

    return (
        <div className="register-container">
            <h2>Sign up</h2>

            <form onSubmit={handleSubmit(submitHandler)}>
                <div className="input-group">
                    <label>Username</label>
                    <input
                        {...register("username", { required: true })}
                        type="text"
                        placeholder="Enter username"
                    />
                </div>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        {...register("email", { required: true })}
                        type="text"
                        placeholder="Enter email"
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
                    {loading ? "Sign Up...." : "Sign Up"}
                </button>
            </form>

            <span className="link" onClick={goToSignin}>
                Already have an account? Sign In
            </span>
        </div>
    );
};

export default RegisterPage;
