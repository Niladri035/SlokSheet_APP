import React, { useState } from 'react'
import { createPost } from '../services/post.api'
import { useNavigate } from 'react-router'
import PageWrapper from '../../shared/PageWrapper'
import "../style/create-post.scss"

const CreatePost = () => {
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!image) {
            alert("Please select an image")
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("caption", caption)
            formData.append("chacha", image)

            await createPost(formData)
            setCaption("")
            setImage(null)
            setPreview(null)
            alert("Post created successfully!")
            navigate("/")
        } catch {
            alert("Failed to create post")
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageWrapper>
            <main className="create-post-page">
                <div className="create-post-container">
                    <h1>Create Post</h1>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write your caption..."
                            maxLength="500"
                        />
                        
                        <div className="image-input">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="image-input"
                            />
                            <label htmlFor="image-input">Choose Image</label>
                        </div>

                        {preview && (
                            <div className="preview">
                                <img src={preview} alt="Preview" />
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="button primary-button"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Post"}
                        </button>
                    </form>
                </div>
            </main>
        </PageWrapper>
    )
}

export default CreatePost
