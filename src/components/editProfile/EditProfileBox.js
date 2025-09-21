"use client"
import React from 'react'
import "./style.scss"
import { useState, useEffect } from 'react'
import axios from '../../lib/axiosConfig'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { setNewUsername } from '../../store/slice/user/user.slice'

const EditProfileBox = ({ openProfileBox, setOpenProfileBox }) => {
    const {user} = useSelector((state) => state.user)
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [username, setUsername] = useState(user?.username)
    const [bio_name, setBio_name] = useState(user?.bio_name || "")
    const [bio, setBio] = useState(user?.bio ||"")
    const [avatar, setAvatar] = useState("")
    const [avatarPreview, setAvatarPreview] = useState(null)
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        if (openProfileBox) {
            setShouldRender(true);
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            setTimeout(() => setShouldRender(false), 300);
        }
    }, [openProfileBox]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatarPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("bio_name", bio_name);
        formData.append("bio", bio);
        if (avatar) {
            formData.append("avatar", avatar);
        }

        try {
            const res = await axios.post("/api/user/edit-profile", formData)
            if (res.status === 200) {
                toast("Profile updated successfully!");
                setOpenProfileBox(false);
                dispatch(setNewUsername(username))
                router.push(`/@${username}`)
            }
        } catch (err) {
            if (err.response.status === 400) {
                toast.error("Username is not available");
            } else {
                console.error("Error updating profile", err);
                toast.error("Something went wrong. Please try again.");
            }
        }
    };




    const handleClose = (e) => {
        if (e.target.classList.contains('Edit-profile')) {
            setOpenProfileBox(false);
        }

    };


    if (!shouldRender) return null;

    return (
        <div className={`Edit-profile ${isVisible ? "visible" : ""}`} onClick={handleClose}>
            <div className={`edit-form-container ${isVisible ? "visible" : ""}`}>
                <div className="f-box">
                    <div className="form-header">
                        <h2>Edit Your Profile</h2>
                        <button
                            className="close-btn"
                            onClick={() => setOpenProfileBox(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="profile-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-wrapper">
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="form-input"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="bio_name">Display Name</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="bio_name"
                                    name="bio_name"
                                    className="form-input"
                                    placeholder="Your display name"
                                    value={bio_name}
                                    onChange={(e) => setBio_name(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="avatar">Profile Avatar</label>
                            <div className={`file-input-wrapper `}>
                                <input
                                    type="file"
                                    id="avatar"
                                    name="avatar"
                                    className="file-input"
                                    accept="image/*"
                                    onChange={handleFileSelect}

                                />
                                <div className="file-input-content">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar preview"
                                            className="avatar-preview"
                                        />
                                    ) : (
                                        <div className="file-icon">📸</div>
                                    )}
                                    <div className="file-text">
                                        {avatarPreview ? avatar?.name || 'Image selected' : 'Upload your avatar'}
                                    </div>
                                    <div className="file-subtext">
                                        {avatarPreview ? 'Click to change' : 'Drag & drop or click to select'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="bio">Bio</label>
                            <div className="input-wrapper">
                                <textarea
                                    id="bio"
                                    name="bio"
                                    className="form-input textarea"
                                    placeholder="Tell us about yourself"
                                    rows="4"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setOpenProfileBox(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="submit-btn"
                                onClick={handleSubmit}
                            >
                                Save Changes ✨
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfileBox