"use client"
import FullScreen from '../../../components/fullScreenImageView/FullScreenImage'
import Loading from '../../../components/loadingSpinner/Loading'
import axios from '../../../lib/axiosConfig'
import { motion } from "framer-motion"
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import "./style.scss"

const KnotDetailPage = () => {
    const {user} = useSelector((state) => state.user)
    const { id } = useParams();
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({})

    const [comments, setComments] = useState([])

    const currentUser = user?._id === data?.userId?._id
    const knotDetail = async (id) => {
        setLoading(true)
        try {
            const res = await axios.get(`/api/knot/getKnotById/${id}`)
            setData(res.data.knot)
            setComments(res.data.knot.comments || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const backHandler = () => {
        router.back()
    }

    useEffect(() => {
        if (id) knotDetail(id)
    }, [id])

    const formateDate = (d) => {
        const date = new Date(d)
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "long" });
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        const diffMs = now - date; // difference in milliseconds
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) return `${diffSec}s`; // seconds
        if (diffMin < 60) return `${diffMin}m`; // minutes
        if (diffHour < 24) return `${diffHour}h`; // hours
        return `${diffDay}d ago`; // days
    };


    const handleLike = async (id) => {
        try {
            const res = await axios.post(`/api/knot/${id}/like`)
            setData((prev) => ({
                ...prev, likes: res.data?.likes
            }))
        } catch (error) {
            toast.error("Something went wrong")
        }
    }


    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [sliderImages, setSliderImages] = useState([]);
    const [initialSlideIndex, setInitialSlideIndex] = useState(0);

    const handleImageClick = (imageIndex) => {
        if (!data?.images) return;


        const images = data.images.map((img, idx) => ({
            src: img
        }))
        setSliderImages(images);
        setInitialSlideIndex(imageIndex);
        setIsSliderOpen(true);
    };

    const textareaRefs = useRef({})

    const handleInput = (e) => {
        const target = e.target
        target.style.height = "auto"
        target.style.height = target.scrollHeight + "px"
    }
    const [text, setText] = useState("")
    const addComment = async (id) => {
        try {
            const res = await axios.post(`/api/knot/${id}/comment`, {
                comment: text
            })
            setText("")
            setData((prev) => ({
                ...prev, comments: res.data.comments
            }))
            setComments(res.data.comments || [])
        } catch (error) {
            console.log(error)
        }
    }


    //Top-See comment change according to the Screen Size
    const [mobileView, setMobileView] = useState(false)
    useEffect(() => {
        // Function to check screen size
        const handleResize = () => {
            setMobileView(window.innerWidth < 768)
        }

        // Run on mount
        handleResize()

        // Add listener
        window.addEventListener("resize", handleResize)

        // Cleanup
        return () => window.removeEventListener("resize", handleResize)
    }, [])



    const [viewComment, setViewComment] = useState(false)
    const handleToggle = () => {
        setViewComment((prev) => !prev)

    }


    const handleCommentClose = () => {
        setViewComment(false)
    }
    const handleCommentOpen = () => {
        if (mobileView) {
            setViewComment(true)
        }
    }



    if (loading) return <Loading />
    return (

        <div className='KnotDetail'>
            <div className="knot-container">
                <div className="knot-header">
                    <div onClick={backHandler} className="arr">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M520-200 80-480l440-280-137 240h497v80H383l137 240Z" /></svg>
                    </div>
                    <div className="head">
                        <h1>Knot</h1>
                        <p>Views</p>
                    </div>
                    <div className="menu">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
                    </div>
                </div>
                <div className="main-div">
                    <div onClick={handleCommentClose} className={`left transition-all duration-300 ${viewComment ? "max-md:h-[100%] bg-black opacity-40" : "max-md:h-[calc(100% - 4rem)]"}`}>
                        <div className="knot-content">
                            <div className="knot-heading">
                                <div className="user-logo">
                                    <img src={data.userId?.avatar || "./user_logo.png"} alt="" />
                                </div>
                                <div onClick={() => router.push(`/@${data.userId?.username}`)} className="user-username">
                                    <h1>{data.userId?.username}</h1>
                                    <p>{formateDate(data.createdAt)}</p>
                                </div>
                            </div>


                            <div className="knot-detail">
                                <p>{data?.caption}</p>
                                {data.images?.length > 0 && (
                                    <div className="image-container">
                                        {data?.images.map((img, idx) => (
                                            <div onClick={(e) => {
                                                handleImageClick(idx)
                                            }} key={idx} className="image">
                                                <img src={img} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>


                            <div className="knot-footer">
                                {
                                    currentUser ? (
                                        <>
                                            <div className="b" onClick={() => handleLike(data._id)}>
                                                {data.likes?.includes(user?._id) ? (
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
                                                <span>{data.likes?.length}</span>
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
                                            <div className="b" onClick={() => handleLike(data._id)}>
                                                {data.likes?.includes(user?._id) ? (
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
                                                <span>{data.likes?.length}</span>
                                            </div>

                                            <div className="b">
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
                                                    <path d="M21 13a7 7 0 0 1-7 7H8l-5 3 1.5-4.5A7 7 0 0 1 3 13a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7z"></path>
                                                </svg>
                                                <span>{data.comments?.length}</span>
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
                        <div className="knot-comment-section">
                            < motion.div
                                className="comment-section"
                            >
                                <div className="user-image">
                                    <img src={user?.avatar || "./user_logo.png"} alt="" />
                                </div>
                                <div className="user-header">
                                    <h1>{user?.username}</h1>

                                    <div className="comment-handle">
                                        <textarea
                                            ref={(el) => (textareaRefs.current[data._id] = el)}
                                            rows={1}
                                            placeholder={`Reply to ${data.userId?.username}`}
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

                                        <button onClick={() => addComment(data._id)}>
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
                        </div>
                    </div>
                    <div className={`right transition-all duration-300 ${viewComment ? "max-md:h-[200%] " : "max-md:h-[4rem]"}`}>
                        <div onClick={handleCommentOpen} className="right-heading">
                            {
                                mobileView ? <h1>See Comments</h1> : <h1>Top comments</h1>
                            }
                            <div
                                className={`toggle  ${viewComment ? "bg-blue-600" : "bg-zinc-600"} w-[3.5rem] h-[1.4rem] relative rounded-[1rem] cursor-pointer transition-colors transition-all duration-300 `}
                                onClick={(e) => {
                                    e.stopPropagation(),
                                        handleToggle()
                                }}
                            >
                                <div
                                    className={`circle absolute top-0 w-[1.4rem] h-[1.4rem] bg-white rounded-full transition-all duration-300 ${viewComment ? "right-0" : "left-0"}`}
                                />
                            </div>
                        </div>
                        {
                            comments.length === 0 ? <h1 className='Fallback'>No Comments Yet</h1> : (
                                comments.map((comment, idx) => (
                                    <div key={idx} className="box">
                                        <div className="top">
                                            <div className="header-section">
                                                <div className="user-logo">
                                                    <img src={comment.avatar || "./user_logo.png"} alt="" />
                                                </div>
                                                <div className="user-info">
                                                    <h1>{comment.username}</h1>
                                                    <p>{formatTime(comment.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="comment">
                                            <p>{comment.comment}</p>

                                            <div className="comment-footer">
                                                <div className="b2">
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
                                                    <h1>2</h1>
                                                </div>
                                                <div className="b2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" /></svg>
                                                    <h1>2</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))

                            )
                        }
                    </div>

                </div>
            </div>
            <FullScreen
                images={sliderImages}
                initialIdx={initialSlideIndex}
                open={isSliderOpen}
                close={() => setIsSliderOpen(false)}
            />
        </div>

    )
}

export default KnotDetailPage
