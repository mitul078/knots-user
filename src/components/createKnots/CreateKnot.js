"use client"
import React, { useEffect, useState, useRef } from "react"
import "./style.scss"
import axios from "../../lib/axiosConfig"
import { useSelector } from "react-redux"
import ProtectedRoute from "../ProtectedRoute"
import Loading from "components/loadingSpinner/Loading"
import toast from "react-hot-toast"
const CreateKnot = ({ open, setOpen }) => {
    const [loading , setLoading] = useState(false)
    const { user } = useSelector((state) => state.user)
    const [caption, setCaption] = useState("")
    const [images, setImages] = useState([])
    const fileInputRef = useRef(null)
    const handleInput = (e) => {
        const target = e.target
        target.style.height = "auto"
        target.style.height = target.scrollHeight + "px"
        setCaption(e.target.value)
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }))
        setImages(prev => [...prev, ...newImages])
    }


    // Remove image
    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }


    const [visibility, setVisibility] = useState("public")
    const handleVisibility = () => {
        try {
            const newVisibility = visibility === "public" ? "friend" : "public"
            setVisibility(newVisibility)
        } catch (error) {
            console.log(error)
        }
    }

    const handlePost = async () => {
        setLoading(true)
        
        if (!caption.trim() && images.length === 0) return

        try {
            const formData = new FormData()
            formData.append("caption", caption)
            images.forEach(img => {
                formData.append("images", img.file)
            })
            formData.append("visibility", visibility)



            await axios.post("/api/knot/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            // reset
            setCaption("")
            setImages([])
            
            setOpen(false)
            toast.success("Knot Created Successfully.")
        } catch (error) {
            console.error(error)
        }finally{
            setTimeout(() => {
                setLoading(false)
            },2000)
        }
    }

    const [isVisible, setIsVisible] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        if (open) {
            setShouldRender(true)
            // Small delay to ensure the element is rendered before applying the visible class
            setTimeout(() => setIsVisible(true), 10)
        } else {
            setIsVisible(false)
            // Wait for transition to complete before removing from DOM
            setTimeout(() => setShouldRender(false), 300)
        }
    }, [open])
    const handleClose = () => {
        setOpen(false)
    }

    if (!shouldRender) return null

    return (
        <ProtectedRoute>
            <div onClick={handleClose} className={`DialogBox fixed inset-0 flex items-center justify-center bg-black ${isVisible ? 'visible' : ''
                }`}>
                <div onClick={(e) => e.stopPropagation()} className={`box ${isVisible ? 'visible' : ''}`}>
                    <div onClick={(e) => e.stopPropagation()} className="create-knot-header">
                        <button onClick={(e) => {
                            setOpen(false)
                            e.stopPropagation()
                        }}>Cancel</button>
                        <h1 >New Knot</h1>
                    </div>
                    <div className="content">
                        <div className="user-logo">
                            <img src={user?.avatar || "./user_logo.png"} alt="" />
                        </div>
                        <div className="knot-info">
                            <div className="user-info">
                                <h1>{user?.username}</h1>
                            </div>
                            <div className="input-field">
                                <textarea
                                    rows={1}
                                    placeholder="What's new.."
                                    onInput={handleInput}
                                    style={{
                                        resize: "none",
                                        overflow: "auto",
                                        maxHeight: "200px",
                                    }}
                                />


                                {images.length > 0 && (
                                    <div className="display-image">
                                        {images.map((img, index) => (
                                            <div className="image" key={index}>
                                                <img src={img.preview} alt="preview" />
                                                <div className="delete">
                                                    <button onClick={() => removeImage(index)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                            aria-label="Close">
                                                            <line x1="18" y1="6" x2="6" y2="18" />
                                                            <line x1="6" y1="6" x2="18" y2="18" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="btns">
                                    <button type="button" onClick={() => fileInputRef.current.click()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                            aria-label="Gallery">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="M21 15l-5-5L5 21" />
                                        </svg>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="footer-info">
                            <h1>Anyone can reply and quote</h1>
                            <div className="flex gap-2 items-center">
                                <p>Make it friend(only your friends can see the knots)</p>
                                <div
                                    className={`create-knot-toggle w-[3.5rem] h-[1.4rem] relative rounded-[1rem] cursor-pointer transition-colors duration-300 ${visibility === "public" ? "bg-zinc-300" : "bg-green-400"
                                        }`}
                                    onClick={handleVisibility}
                                >
                                    <div
                                        className={`create-knot-circle absolute top-0 w-[1.4rem] h-[1.4rem] bg-white rounded-full transition-all duration-300 ${visibility === "friend" ? "right-0" : "left-0"
                                            }`}
                                    />
                                </div>
                            </div>

                        </div>
                        <button onClick={handlePost}>{loading ? <Loading/> : "Post"}</button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}

export default CreateKnot
