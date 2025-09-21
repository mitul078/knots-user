"use client"
import React, { useEffect, useRef } from "react";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { getMessage } from "../../../store/slice/message/message.thunk";
import ProtectedRoute from "../../../components/ProtectedRoute";

const Messages = ({ selectedUser }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { messages } = useSelector((state) => state.message);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // scroll to bottom whenever messages update
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    useEffect(() => {
        if (selectedUser?._id) {
            dispatch(getMessage({ receiverId: selectedUser._id }));
        }
    }, [dispatch, selectedUser?._id]);

    return (
        <ProtectedRoute>
            {messages && messages.length > 0 ? (
                messages.map((message) => {
                    const isSender =
                        message.senderId?.toString() === user?._id?.toString();

                    return (
                        <div
                            key={message._id || `${message.senderId}-${message.createdAt}`}
                            className={`chat ${isSender ? "chat-end" : "chat-start"}`}
                        >
                            <div className="chat-bubble">
                                <h1>{message.content}</h1>
                                <p className="text-xs opacity-50">
                                    {message.createdAt
                                        ? new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : ""}
                                </p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-center opacity-50">No messages yet</p>
            )}

            <div ref={messagesEndRef} />
        </ProtectedRoute>
    );
};

export default Messages;
