"use client";
import axios from "../../lib/axiosConfig";
import socket from "../../lib/socketConfig";
import { addMessage } from "../../store/slice/message/message.slice";
import { setSelectedUser } from "../../store/slice/user/user.slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../loadingSpinner/Loading";
import Messages from "./messages/Messages";
import "./style.scss";


const MessageBox = ({ openMessageBox, setOpenMessageBox }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const { selectedUser, user } = useSelector((state) => state.user);
    const [chatBoxes, setChatBoxes] = useState([])
    const [mobileChatView, setMobileChatView] = useState(false)

    const handleMobileChatView = () => {
        setMobileChatView(true)
    }
    const closeMobileChatView = () => {
        setMobileChatView(false)
    }

    // Search users
    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults([]);
            setMessage("");
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await axios.post("/api/user/search-user", { word: query });
                const users = res.data.users || []
                setResults(users)

                if (users.length === 0) {
                    setMessage("No User Found")
                }
                else {
                    setMessage("")
                }
            } catch (error) {
                console.error(error);
                setResults([]);
                setMessage("Something went wrong");
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    // Animate open/close
    useEffect(() => {
        if (openMessageBox) {
            setShouldRender(true);
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            setTimeout(() => setShouldRender(false), 300);
        }
    }, [openMessageBox]);


    const closeChat = () => setOpenMessageBox(false);

    const handleUserClick = (data) => {
        dispatch(setSelectedUser(data));
    };

    const handleConnectionClick = (data) => {
        dispatch(setSelectedUser(data.receiver))
    }

    const [userMessage, setUserMessage] = useState("")
    const [loader, setLoader] = useState(false)

    const handleMessageSend = async () => {
        if (!userMessage.trim()) return;
        setLoader(true)
        try {
            const msg = {
                senderId: user?._id,
                receiverId: selectedUser?._id,
                content: userMessage,
            };

            socket.emit("message", msg);
            setUserMessage("");
        } catch (error) {
            console.log(error)
        } finally {
            setLoader(false)
        }
    }


    useEffect(() => {

        if (user?._id) {
            socket.emit("join", user._id);
        }
        socket.on("message", (msg) => {
            dispatch(addMessage(msg))
        });


        return () => {
            socket.off("message")

        };
    }, [user, dispatch])


    useEffect(() => {
        (async () => {
            if (user) {
                try {
                    const res = await axios.get("/api/room/get-chat-box")
                    setChatBoxes(res.data)
                } catch (error) {
                    console.log(error)
                }
            }
        })()

        socket.on("chatBox", async () => {
            try {
                const res = await axios.get("/api/room/get-chat-box")
                setChatBoxes(res.data)
            } catch (error) {
                console.log(error)
            }
        })

        return () => {
            socket.off("chatBox");
        };
    }, [user])

    //message loading
    useEffect(() => {
        if (selectedUser) {
            setLoader(true);
            setTimeout(() => setLoader(false), 500);
        }
    }, [selectedUser]);



    if (!shouldRender) return null;


    return (
        <div className={`Message ${isVisible ? "visible" : ""}`}>
            <div className={`message-container ${isVisible ? "visible" : ""}`}>
                <div className="top-layer">
                    <svg
                        onClick={closeChat}
                        xmlns="http://www.w3.org/2000/svg"
                        height="30px"
                        viewBox="0 -960 960 960"
                        width="30px"
                        fill="#e3e3e3"
                    >
                        <path d="M520-200 80-480l440-280-137 240h497v80H383l137 240Z" />
                    </svg>
                    <h1>Connections</h1>
                </div>

                <div className="message-content">
                    {/* Left side - Connections */}
                    <div className="connection-list">
                        <div className="search-layer">
                            <div className="search-bar">
                                <input
                                    onChange={(e) => setQuery(e.target.value)}
                                    value={query}
                                    type="text"
                                    className="search-input"
                                    placeholder="Search"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <Loading />
                        ) : message ? (
                            <p className="no-result">{message}</p>
                        ) : (
                            <div
                                className={`search-content ${results.length > 0 ? "pb-16" : "pb-0"
                                    }`}
                            >
                                {results.map((profile, i) => (
                                    <div
                                        onClick={() => {
                                            handleUserClick(profile)
                                            handleMobileChatView()
                                        }}
                                        key={i}
                                        className="box"
                                    >
                                        <div className="left-side">
                                            <img src={profile.avatar || "./user_logo.png"} alt="" />
                                            <div className="info">
                                                <h1>{profile.username}</h1>
                                                <p>{profile.bio_name || ""}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {
                            query.trim().length === 0 &&
                            <>
                                {
                                    chatBoxes.length > 0 ? (
                                        chatBoxes.map((box) => (
                                            <div key={box.receiver._id} onClick={() => {
                                                handleConnectionClick(box)
                                                handleMobileChatView()

                                            }} className="connection">
                                                <div className="left-side">
                                                    <img src={box?.receiver?.avatar || "./user_logo.png"} alt="" />
                                                </div>
                                                <div className="right-side">
                                                    <div className="i">
                                                        <h1>{box.receiver?.username}</h1>
                                                        <p>
                                                            {box?.lastMessage
                                                                ? box.lastMessage.split(" ").slice(0, 5).join(" ") +
                                                                (box.lastMessage.split(" ").length > 5 ? "..." : "")
                                                                : ""}
                                                        </p>


                                                    </div>
                                                    <div className="time">
                                                        <p>{box?.lastMessageTime && new Date(box.lastMessageTime).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false
                                                        })}</p>
                                                    </div>
                                                </div>
                                            </div>

                                        ))
                                    ) : (
                                        <h1>Start conversation</h1>
                                    )
                                }
                            </>
                        }
                    </div>

                    {/* Right side - Chat */}
                    {
                        selectedUser && (
                            <div className="connection-chat window-view">
                                {
                                    <div className="chat-area">
                                        <div className="top-chat-layer">
                                            <div className="chat-left-side">
                                                <div className="image">
                                                    <img src="./user_logo.png" alt="" />
                                                </div>
                                                <div className="info">
                                                    <h1>{selectedUser?.username}</h1>
                                                    <p>{selectedUser?.bio_name} </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="line"></div>
                                        <div className="chats">
                                            {
                                                loader ? <Loading /> : (
                                                    <Messages selectedUser={selectedUser} />
                                                )
                                            }
                                        </div>
                                    </div>

                                }

                                <div className="bottom-layer">
                                    <div className="input">
                                        <input onChange={(e) => setUserMessage(e.target.value)} value={userMessage} type="text" placeholder="Type Here" />
                                    </div>
                                    <div className="send">
                                        <button onClick={handleMessageSend}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="36px"
                                                viewBox="0 -960 960 960"
                                                width="36px"
                                                fill="#e3e3e3"
                                            >
                                                <path d="M400-40v-360H40l400-400h360v360L400-40Zm240-353 80-80v-247H473l-80 80h247v247ZM480-233l80-80v-247H313l-80 80h247v247Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        selectedUser && (

                            <div className={`connection-chat mobile-view ${mobileChatView ? "" : "hidden"} `}>
                                {
                                    <div className="chat-area">
                                        <div className="top-chat-layer">
                                            <div className="chat-left-side">
                                                <svg onClick={() => closeMobileChatView()} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#e3e3e3"><path d="M520-200 80-480l440-280-137 240h497v80H383l137 240Z" /></svg>
                                                <div className="image">
                                                    <img src="./user_logo.png" alt="" />
                                                </div>
                                                <div className="info">
                                                    <h1>{selectedUser?.username}</h1>
                                                    <p>{selectedUser?.bio_name} </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="chats">
                                            {
                                                loader ? <Loading /> : (
                                                    <Messages selectedUser={selectedUser} />
                                                )
                                            }
                                        </div>
                                    </div>

                                }

                                <div className="bottom-layer">
                                    <div className="input">
                                        <input onChange={(e) => setUserMessage(e.target.value)} value={userMessage} type="text" placeholder="Type Here" />
                                    </div>
                                    <div className="send">
                                        <button onClick={handleMessageSend}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="36px"
                                                viewBox="0 -960 960 960"
                                                width="36px"
                                                fill="#e3e3e3"
                                            >
                                                <path d="M400-40v-360H40l400-400h360v360L400-40Zm240-353 80-80v-247H473l-80 80h247v247ZM480-233l80-80v-247H313l-80 80h247v247Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default MessageBox;
