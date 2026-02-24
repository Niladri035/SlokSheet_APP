import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { updateProfile, getCurrentUser } from '../services/auth.api'
import { togglePrivateAccount } from '../../posts/services/post.api'
import "../style/profile.scss"

const Profile = () => {
    const { user, isPrivate, setIsPrivate } = useAuth()
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [bio, setBio] = useState(user?.bio || "")
    const [profileImage, setProfileImage] = useState(null)
    const [preview, setPreview] = useState(user?.profileImage)
    const [userInfo, setUserInfo] = useState(user)

    useEffect(() => {
        fetchUserInfo()
    }, [])

    const fetchUserInfo = async () => {
        try {
            const data = await getCurrentUser()
            setUserInfo(data.user)
            setBio(data.user.bio || "")
            setPreview(data.user.profileImage)
        } catch (error) {
            console.error("Failed to fetch user info:", error)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setProfileImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleTogglePrivate = async () => {
        setLoading(true)
        try {
            const data = await togglePrivateAccount()
            setIsPrivate(data.isPrivate)
            alert(data.message)
        } catch (error) {
            console.error("Toggle privacy error:", error)
            const errorMessage = error.response?.data?.error || error.message || "Failed to update privacy settings"
            alert(`Error: ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("bio", bio)
            if (profileImage) {
                formData.append("profileImage", profileImage)
            }

            console.log("Submitting formData with bio:", bio, "and file:", profileImage?.name)

            const data = await updateProfile(formData)
            setUserInfo(data.user)
            setBio(data.user.bio)
            setPreview(data.user.profileImage)
            setIsEditing(false)
            setProfileImage(null)
            alert("Profile updated successfully!")
        } catch (error) {
            console.error("Profile update error:", error)
            const errorMessage = error.response?.data?.error || error.message || "Failed to update profile"
            alert(`Error: ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <img src={preview} alt="" className="profile-image" />
                    <div className="profile-info">
                        <h1>{userInfo?.username}</h1>
                        <p>{userInfo?.bio || "No bio added"}</p>
                    </div>
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="edit-form">
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself..."
                                maxLength="150"
                            />
                            <small>{bio.length}/150</small>
                        </div>

                        <div className="form-group">
                            <label>Profile Photo</label>
                            <div className="image-input">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    id="profile-image"
                                />
                                <label htmlFor="profile-image" className="file-label">
                                    Choose Photo
                                </label>
                            </div>

                            {preview && (
                                <div className="preview-container">
                                    <img src={preview} alt="Preview" className="preview-img" />
                                </div>
                            )}
                        </div>

                        <div className="button-group">
                            <button type="submit" className="button primary-button" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                            <button 
                                type="button" 
                                className="button secondary-button"
                                onClick={() => {
                                    setIsEditing(false)
                                    setBio(userInfo?.bio || "")
                                    setProfileImage(null)
                                    setPreview(userInfo?.profileImage)
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="privacy-settings">
                            <h2>Privacy Settings</h2>
                            <div className="privacy-toggle">
                                <span>Account Status: {isPrivate ? "Private" : "Public"}</span>
                                <button 
                                    className="button primary-button"
                                    onClick={handleTogglePrivate}
                                    disabled={loading}
                                >
                                    {loading ? "Updating..." : isPrivate ? "Make Public" : "Make Private"}
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsEditing(true)}
                            className="button primary-button edit-btn"
                        >
                            Edit Profile
                        </button>
                    </>
                )}
            </div>
        </main>
    )
}

export default Profile
