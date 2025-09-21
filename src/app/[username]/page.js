"use client";
import EditProfileBox from "../../components/editProfile/EditProfileBox";
import FollowDetail from "../../components/followDetail/FollowDetailBox";
import Loading from "../../components/loadingSpinner/Loading";
import MessageBox from "../../components/messageRoom/MessageRoom";

import ProtectedRoute from "../../components/ProtectedRoute";
import axios from "../../lib/axiosConfig";
import { setSelectedUser } from "../../store/slice/user/user.slice";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";

const UserProfilePage = () => {
    const { user } = useSelector((state) => state.user)
    const [profileUser, setProfileUser] = useState(null)
    const { username } = useParams();
    const [knots, setKnots] = useState([]);
    const [status, setStatus] = useState("Follow");
    const [open, setOpen] = useState(false)
    const [currentView, setCurrentView] = useState(null)
    const [openMessageBox, setOpenMessageBox] = useState(false) // change it later
    const [loading, setLoading] = useState(false)
    const [openProfileBox, setOpenProfileBox] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()

    const handleOpenModal = (viewType) => {
        setCurrentView(viewType)
        setOpen(true)
    }


    const chatHandler = (data) => {
        dispatch(setSelectedUser(data))
    }



    useEffect(() => {
        let cancel = false;

        (async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/user/@${username}`);
                if (!cancel) {
                    setProfileUser(res.data.user);
                    setKnots(res.data.knots);
                }
            } catch (error) {
                if (!cancel) {
                    console.log(error);
                    toast.error("User not found");
                    router.push("/");
                }
            } finally {
                if (!cancel) {
                    setLoading(false);
                }
            }
        })();

        
        return () => {
            cancel = true;
        };
    }, [username]);





    const loggedUserProfile = profileUser?.username === user?.username


    // Fetch follow status
    useEffect(() => {
        if (!profileUser?._id) return;
        (async () => {
            setLoading(true)
            try {
                const res = await axios.get(`/api/user/status/${profileUser._id}`);
                setStatus(res.data.status);
            } catch (error) {
                console.error("Failed to fetch status:", error);
            } finally {
                setLoading(false)
            }
        })()
    }, [profileUser])


    const handleFollow = async (id) => {
        if (!id) return;
        setLoading(true)
        try {
            if (status === "Follow") {
                await axios.post(`/api/user/send-request/${id}`);
                setStatus("Requested");

            } else if (status === "Requested") {
                await axios.post(`/api/user/unfollow-friend/${id}`);
                setStatus("Follow");

            } else if (status === "Remove Friend") {
                await axios.post(`/api/user/unfollow-friend/${id}`);
                setStatus("Follow");

            } else if (status === "Confirm") {
                await axios.post(`/api/user/accept/${id}`);
                setStatus("Friends");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false)
        }
    };



    const handleRejectRequest = async (id) => {
        setLoading(true)
        try {
            await axios.post(`/api/user/reject/${id}`);
            setStatus("Follow");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false)
        }
    };


    return (
        <ProtectedRoute>
            <div className="UserProfile">
                {
                    loading ? <Loading /> : (
                        <div className="container">
                            <div className="user-info">
                                <div className="top-layer">

                                    <div className="user-logo">
                                        <img
                                            src={profileUser?.avatar || "user_logo.png"}
                                            onError={(e) => (e.currentTarget.src = "./user_logo.png")}
                                            alt="user avatar"
                                        />

                                    </div>
                                    <div className="user-detail">
                                        <div className="header">
                                            <h1>{profileUser?.username}</h1>
                                            <div className="menu"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M80-160v-160h160v160H80Zm240 0v-160h560v160H320ZM80-400v-160h160v160H80Zm240 0v-160h560v160H320ZM80-640v-160h160v160H80Zm240 0v-160h560v160H320Z" /></svg></div>
                                        </div>

                                        <div className="count">
                                            <div className="box"> <span>{knots?.length}</span> <h1> Knots</h1></div>
                                            <div className="box"> <span>{profileUser?.followersCount}</span> <h1 onClick={() => handleOpenModal("follower")}> Followers</h1></div>
                                            <div className="box"> <span>{profileUser?.followingCount}</span> <h1 onClick={() => handleOpenModal("following")}> Following</h1></div>

                                        </div>
                                        {
                                            !loggedUserProfile && (

                                                <>
                                                    <div className="btns">
                                                        <div className="follow">
                                                            <button onClick={() => handleFollow(profileUser._id)} className={`${status === "Remove Friend" ? "remove rounded bg-red-500" : ""}`}>{status}</button>
                                                        </div>
                                                        {
                                                            status === "Confirm" && (
                                                                <button className="delete" onClick={() => handleRejectRequest(profileUser._id)}>Delete</button>
                                                            )
                                                        }
                                                        {
                                                            status !== "Confirm" && (
                                                                <div className="message">
                                                                    <button onClick={() => {
                                                                        setOpenMessageBox(true)
                                                                        chatHandler(profileUser)
                                                                    }
                                                                    }>Chat</button>
                                                                </div>
                                                            )
                                                        }
                                                    </div>


                                                </>
                                            )
                                        }{
                                            loggedUserProfile && (
                                                <button onClick={() => setOpenProfileBox(true)} className="EditBtn">Edit Profile</button>
                                            )
                                        }
                                        <div className="window-bio-section">
                                            <p>{profileUser?.bio || "No Bio Provided"}</p>
                                        </div>

                                        <div className="friends">
                                            <button onClick={() => handleOpenModal("friends")}>See Friends</button>
                                        </div>
                                        {!loggedUserProfile && (
                                            <div className="collaborate">
                                                <button>Collaborate with us</button>
                                            </div>
                                        )}

                                    </div>

                                </div>
                                <div className="lower-layer">
                                    <div className="mobile-bio-section">
                                        <p>{profileUser?.bio || "No Bio Provided"}</p>
                                    </div>
                                </div>
                            </div>

                            <FollowDetail profileUser={profileUser} open={open} setOpen={setOpen} setCurrentView={setCurrentView} currentView={currentView} status={status} />

                            <EditProfileBox openProfileBox={openProfileBox} setOpenProfileBox={setOpenProfileBox} />

                            <MessageBox openMessageBox={openMessageBox} setOpenMessageBox={setOpenMessageBox} />

                        </div>
                    )
                }
            </div >

        </ProtectedRoute>
    );
};

export default UserProfilePage;