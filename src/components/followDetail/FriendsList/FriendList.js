"use client"
import Loading from '../../../components/loadingSpinner/Loading'
import axios from '../../../lib/axiosConfig'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import "../FollowingList/style.scss"

const FriendList = ({ profileUser }) => {
    const {user} = useSelector((state) => state.user)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const getData = async () => {
        setLoading(true)
        try {
            const res = await axios.get("/api/user/friends")
            setData(res.data?.friends)
        } catch (error) {
            setData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])



    const handleDate = (dateString) => {
        const date = new Date(dateString)
        const monthShort = date.toLocaleString("en-US", { month: "short" });
        const day = date.getDate();
        return `${monthShort} ${day}`
    }

    if (loading) return <Loading />
    if(!loading && data.length === 0) {
        return <div className='fallback'>No friends yet</div>
    }
    return (
        <div className='List'>
            {data.map((friend) => {
                const isProfileUserRequester = friend.requester._id === profileUser._id;
                const isProfileUserReceiver = friend.receiver._id === profileUser._id;

                const other = isProfileUserRequester ? friend.receiver
                    : isProfileUserReceiver ? friend.requester
                        : null;

                if (!other) return null;

                const isLoggedUser = other._id === user?._id


                return (
                    <div key={friend._id} className="list-box">
                        <div className="b1">
                            <div className="avatar">
                                <img src={other.avatar || "./user_logo.png"} alt="" />
                            </div>
                            <div className="username">
                                {isLoggedUser ? <h1>You</h1> : <h1>{other.username}</h1>}
                            </div>
                        </div>
                        <div className="date">
                            <h1>
                                Connected Since <span>{handleDate(friend.createdAt)}</span>
                            </h1>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default FriendList
