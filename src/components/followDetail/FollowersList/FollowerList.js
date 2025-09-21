"use client"
import Loading from '../../../components/loadingSpinner/Loading'
import axios from '../../../lib/axiosConfig'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import "../FollowingList/style.scss"
const FollowerList = ({ profileUser }) => {
    const {user} = useSelector((state) => state.user)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            try {
                if (profileUser._id === user._id) {
                    const res = await axios("/api/user/follower")
                    setData(res.data.list)
                }
                else {
                    const res = await axios(`/api/user/user-follower/${profileUser._id}`)
                    setData(res.data.list)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])
    if (loading) return <Loading />
    if (!loading && data.length === 0) {
        return <div className='fallback'>No friends yet</div>
    }
    return (
        <div className='List'>
            {
                data.map((friend) => (
                    <div key={friend._id} className="list-box">
                        <div className="b1">
                            <div className="avatar">
                                <img src={friend.follower.avatar || "./user_logo.png"} alt="" />
                            </div>
                            <div className="username">
                                <h1>{friend.follower.username}</h1>
                            </div>
                        </div>
                        <div className="b2">
                            <button>Follow</button>
                        </div>
                    </div>

                ))
            }
        </div>
    )
}

export default FollowerList
