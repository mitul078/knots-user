"use client"
import FollowingKnots from "../components/followingKnots/FollowingKnots"
import ForYou from "../components/foryou/Foryou"

import { useState } from 'react'
import "./feed.scss"


const Feed = () => {
  const [activeTab, setActiveTab] = useState("forYou")


  return (
    <div className='Feed'>
      <div className="header">
        <h1
          className={activeTab === "forYou" ? "active" : ""}
          onClick={() => setActiveTab("forYou")}
        >
          For you
        </h1>
        <h1
          className={activeTab === "following" ? "active" : ""}
          onClick={() => setActiveTab("following")}
        >
          Following
        </h1>

      </div>
      <div className="knots-container">
        {activeTab === "forYou" && <ForYou />}
        {activeTab === "following" && <FollowingKnots />}

      </div>
    </div>
  )
}

export default Feed
