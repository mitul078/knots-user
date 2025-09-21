"use client"
import React from 'react'
import "./style.scss"
import { useEffect, useState } from 'react'
import FriendsList from "../followDetail/FriendsList/FriendList"
import FollowersList from "../followDetail/FollowersList/FollowerList"
import FollowingList from "../followDetail/FollowingList/FollowingList"
import toast from 'react-hot-toast'

const FollowDetail = ({ open, setOpen, currentView, setCurrentView, profileUser, status }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)
    

    useEffect(() => {
        if (open) {
            if (status === "Follow" || status === "Requested") {
                toast.error("You didn't follow each other")
                setOpen(false)
                return
            }

            setShouldRender(true)
            setTimeout(() => setIsVisible(true), 10)
        } else {
            setIsVisible(false)
            setTimeout(() => setShouldRender(false), 300)
        }
    }, [open, status])

    const handleClose = () => {
        setOpen(false)
    }
    const getActiveTab = (tab) => {
        return currentView === tab ? "active" : ""
    }



    const renderContent = () => {
        switch (currentView) {
            case "follower": return <FollowersList profileUser={profileUser} />
            case "following": return <FollowingList profileUser={profileUser} />
            case "friends": return <FriendsList profileUser={profileUser} />
            default: return <FollowingList profileUser={profileUser} />
        }
    }

    const closeDialog = () => {
        setOpen(false)
    }

    if (!shouldRender) return null
    return (
        <div
            onClick={handleClose}
            className={`DialogBox fixed inset-0 flex items-center justify-center bg-black ${isVisible ? 'visible' : ''}`}
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className={`box ${isVisible ? 'visible' : ''}`}
            >
                <div className="top-layer">
                    <div className="arr">
                        <svg onClick={closeDialog} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#e3e3e3"><path d="M520-200 80-480l440-280-137 240h497v80H383l137 240Z" /></svg>
                        <h1>
                            {profileUser?.username}
                        </h1>
                    </div>


                    <div className="arr">
                        <svg  xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#e3e3e3"><path d="M360-240v-80h480v80H360Zm0-200v-80h480v80H360ZM120-640v-80h720v80H120Z" /></svg>
                    </div>
                </div>
                <div className="header">
                    <h1 className={getActiveTab("following")} onClick={() => {
                        setCurrentView && setCurrentView("following")
                    }}>Following</h1>
                    <h1 className={getActiveTab("follower")} onClick={() => setCurrentView && setCurrentView("follower")}>Followers</h1>
                    <h1 className={getActiveTab("friends")} onClick={() => setCurrentView && setCurrentView("friends")}>Friends</h1>
                </div>
                <div className="content">
                    {renderContent()}
                </div>
            </div>
        </div>

    )
}

export default FollowDetail
