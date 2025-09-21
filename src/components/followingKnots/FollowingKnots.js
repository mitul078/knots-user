"use client"
import axios from "../../lib/axiosConfig"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import FullScreen from "../fullScreenImageView/FullScreenImage"
import Loading from "../loadingSpinner/Loading"
import ProtectedRoute from "../ProtectedRoute"
import "./style.scss"


const FollowingKnots = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const router = useRouter()
    const [userID, setUserID] = useState(null)
    const { user } = useSelector((state) => state.user)
    const [openComment, setOpenComment] = useState(null)


    const textareaRefs = useRef({})
    useEffect(() => {
        const fetchKnots = async () => {
            setLoading(true)
            try {
                const res = await axios.get("/api/knot/getFollowingKnot")
                setData(res.data.knots)
            } catch (error) {
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchKnots()
    }, [])


    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${month}/${day}`
    }

    const handleLike = async (id) => {
        setLoading(true)
        try {
            const res = await axios.post(`/api/knot/${id}/like`)
            setData((prev) =>
                prev.map((knot) =>
                    knot._id === id ? { ...knot, likes: res.data.likes } : knot
                )
            )
        } catch (error) {
            toast.error("Something went wrong")
        } finally{
            setLoading(false)
        }
    }

    const handleComment = (id) => {
        setOpenComment(openComment === id ? null : id)
        setTimeout(() => {
            textareaRefs.current[id]?.focus()
        }, 100)
    }

    const handleInput = (e) => {
        const target = e.target
        target.style.height = "auto"
        target.style.height = target.scrollHeight + "px"
    }


    const profileHandler = (uname) => {
        router.push(`/@${uname}`)
    }


    const [text, setText] = useState("")
    const addComment = async (id) => {
        try {
            const res = await axios.post(`/api/knot/${id}/comment`, {
                comment: text
            })
            setText("")
            setData((prev) =>
                prev.map((k) =>
                    k._id === id ? { ...k, comments: res.data.comments } : k
                )
            );
        } catch (error) {
            console.log(error)
        }
    }



    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [sliderImages, setSliderImages] = useState([]);
    const [initialSlideIndex, setInitialSlideIndex] = useState(0);

    const handleImageClick = (imageIndex, knotIdx) => {

        const currentKnot = data[knotIdx]

        const images = currentKnot.images.map((img, idx) => ({
            src: img
        }))
        setSliderImages(images);
        setInitialSlideIndex(imageIndex);
        setIsSliderOpen(true);
    };

    if (loading) return <Loading />
    if (!loading && data.length === 0) {
        return <div className="fallback">
            Everything you watch Follow for more
        </div>
    }

    return (
        <ProtectedRoute>
            <div className="ForYou">
                {!loading &&
                    data.map((knot) => {

                        const currentUser = user && user._id === knot.userId._id
                        return (

                            <div key={knot._id} className="box">
                                {/* upper section */}
                                <div className="upper">
                                    <div className="header-section">
                                        <div className="user-logo">
                                            <img onClick={() => profileHandler(knot.userId.username)} src={knot.userId.avatar || "./user_logo.png"} alt="" />
                                        </div>
                                        <div className="user-info">
                                            <h1 onClick={() => profileHandler(knot.userId.username)}>{knot.userId.username}</h1>
                                            <p>{formatDate(knot.createdAt)}</p>
                                        </div>

                                    </div>
                                    <div className="knot-info">
                                        <div className="knot-detail">
                                            <p>{knot.caption}</p>
                                            {knot.images.length > 0 && (
                                                <div className="image-container">
                                                    {knot.images.map((img, idx) => (
                                                        <div onClick={() => handleImageClick(idx, data.indexOf(knot))} key={idx} className="image">
                                                            <img src={img} alt="" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="footer">

                                            {
                                                currentUser ? (
                                                    <>
                                                        <div className="b" onClick={() => handleLike(knot._id)}>
                                                            {knot.likes.includes(userID) ? (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="25"
                                                                    height="25"
                                                                    viewBox="0 0 24 24"
                                                                    fill="white"
                                                                    stroke="white"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="25"
                                                                    height="25"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="white"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                                                                </svg>
                                                            )}
                                                            <span>{knot.likes.length}</span>
                                                        </div>

                                                        <div className="b">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                                <path d="M22 2L11 13" />
                                                                <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                                                            </svg>

                                                            <span>1</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="b" onClick={() => handleLike(knot._id)}>
                                                            {knot.likes.includes(userID) ? (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="25"
                                                                    height="25"
                                                                    viewBox="0 0 24 24"
                                                                    fill="white"
                                                                    stroke="white"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="25"
                                                                    height="25"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="white"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                                                                </svg>
                                                            )}
                                                            <span>{knot.likes.length}</span>
                                                        </div>

                                                        <div className="b">
                                                            <svg
                                                                onClick={() => handleComment(knot._id)}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="25"
                                                                height="25"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="white"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M21 13a7 7 0 0 1-7 7H8l-5 3 1.5-4.5A7 7 0 0 1 3 13a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7z"></path>
                                                            </svg>
                                                            <span>{knot.comments.length}</span>
                                                        </div>
                                                        <div className="b">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                                viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                                <path d="M17 2l4 4-4 4v-3H8a3 3 0 0 0-3 3v1h-2v-1a5 5 0 0 1 5-5h9V2z" />
                                                                <path d="M7 22l-4-4 4-4v3h9a3 3 0 0 0 3-3v-1h2v1a5 5 0 0 1-5 5H7v3z" />
                                                            </svg>

                                                            <span>1</span>
                                                        </div>

                                                        <div className="b">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                                <path d="M22 2L11 13" />
                                                                <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                                                            </svg>

                                                            <span>1</span>
                                                        </div>
                                                    </>
                                                )
                                            }

                                        </div>
                                    </div>
                                </div>
                                < motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={
                                        openComment === knot._id
                                            ? { height: "fit-content", opacity: 1 }
                                            : { height: 0, opacity: 0 }
                                    }
                                    style={{
                                        pointerEvents: openComment === knot._id ? "auto" : "none"
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="comment-section"
                                >
                                    <div className="user-image">
                                        <img src={user.avatar || "./user_logo.png"} alt="" />
                                    </div>
                                    <div className="user-header">
                                        <h1>{user.username}</h1>

                                        <div className="comment-handle">
                                            <textarea

                                                ref={(el) => (textareaRefs.current[knot._id] = el)}
                                                rows={1}
                                                placeholder={`Reply to ${knot.userId.username}`}
                                                onInput={handleInput}
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}


                                                style={{
                                                    resize: "none",
                                                    overflow: "hidden",
                                                    minHeight: "2rem",
                                                    maxHeight: "200px",
                                                }}
                                            />

                                            <button onClick={() => addComment(knot._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 19V5" />
                                                    <path d="M5 12l7-7 7 7" />
                                                </svg>

                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div >
                        )
                    })}

                <FullScreen
                    images={sliderImages}
                    initialIdx={initialSlideIndex}
                    open={isSliderOpen}
                    close={() => setIsSliderOpen(false)}
                />
            </div >

        </ProtectedRoute>
    )
}

export default FollowingKnots
