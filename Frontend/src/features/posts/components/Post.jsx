import React, { useState } from 'react'
import { likePost, unlikePost, savePost, unsavePost, deletePost } from '../services/post.api'
import { useAuth } from '../../auth/hooks/useAuth'
import Comments from './Comments'
import { motion, AnimatePresence } from 'framer-motion'

const Post = ({ user, post, onSaveToggle }) => {
    const [isLiked, setIsLiked] = useState(post.isLiked || false)
    const [isSaved, setIsSaved] = useState(post.isSaved || false)
    const [showComments, setShowComments] = useState(false)
    const [showBigHeart, setShowBigHeart] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const { user: currentUser } = useAuth()

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deletePost(post._id)
                setIsDeleted(true)
            } catch (error) {
                console.error("Failed to delete post", error)
            }
        }
    }

    if (isDeleted) return null

    const handleLike = async () => {
        try {
            if (isLiked) {
                await unlikePost(post._id)
            } else {
                await likePost(post._id)
            }
            setIsLiked(!isLiked)
        } catch (error) {
            console.error("Failed to like/unlike post", error)
        }
    }

    const handleDoubleClickLike = async () => {
        if (!isLiked) {
            await handleLike()
        }
        setShowBigHeart(true)
        setTimeout(() => setShowBigHeart(false), 1000)
    }

    const handleSave = async () => {
        try {
            if (isSaved) {
                await unsavePost(post._id)
                if (onSaveToggle) onSaveToggle(post._id, false)
            } else {
                await savePost(post._id)
                if (onSaveToggle) onSaveToggle(post._id, true)
            }
            setIsSaved(!isSaved)
        } catch (error) {
            console.error("Failed to save/unsave post", error)
        }
    }

    const handleShare = () => {
        const url = `${window.location.origin}/post/${post._id}`
        navigator.clipboard.writeText(url)
        alert("Post link copied to clipboard!")
    }

    return (
        <div className="post">
            <div className="user" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="img-wrapper">
                        <img src={user?.profileImage || 'https://via.placeholder.com/150'} alt="" />
                    </div>
                    <p>{user?.username || 'Unknown User'}</p>
                </div>
                {currentUser?._id === user?._id && (
                    <motion.button 
                        whileHover={{ scale: 1.1, color: '#ff3040' }} 
                        whileTap={{ scale: 0.9 }} 
                        onClick={handleDelete}
                        title="Delete Post"
                        style={{ background: 'transparent', border: 'none', color: '#A8A8A8', cursor: 'pointer', display: 'flex', padding: 0 }}
                    >
                        <svg aria-label="Delete" fill="none" height="18" viewBox="0 0 24 24" width="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </motion.button>
                )}
            </div>
            <div className="post-image-container" style={{ position: 'relative' }} onDoubleClick={handleDoubleClickLike}>
                <img src={post.imgUrl} alt="" style={{ display: 'block', width: '100%', userSelect: 'none' }} />
                <AnimatePresence>
                    {showBigHeart && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
                            animate={{ scale: 1.5, opacity: 1, x: '-50%', y: '-50%' }}
                            exit={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
                            transition={{ duration: 0.3, type: 'spring' }}
                            style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none' }}
                        >
                            <svg fill="white" height="100" viewBox="0 0 48 48" width="100">
                                <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z" />
                            </svg>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="icons">
                <div className="left">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleLike}>
                        {isLiked ? (
                            <svg className="like" aria-label="Unlike" fill="currentColor" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                        ) : (
                            <svg aria-label="Like" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.155 6.155 0 0 0-4.89 2.191 6.073 6.073 0 0 0-4.89-2.191c-3.14-.02-5.904 2.37-5.904 5.714 0 4.293 3.324 5.992 5.918 8.318 2.08 1.868 3.655 3.251 4.314 3.868a1.597 1.597 0 0 0 2.155 0c.659-.617 2.233-1.999 4.314-3.868 2.594-2.326 5.918-4.025 5.918-8.318 0-3.344-2.763-5.734-5.904-5.714z"></path></svg>
                        )}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowComments(!showComments)}>
                        <svg aria-label="Comment" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleShare}>
                        <svg aria-label="Share Post" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                    </motion.button>
                </div>
                <div className="right">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleSave}>
                        {isSaved ? (
                            <svg className="saved" aria-label="Remove" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path></svg>
                        ) : (
                            <svg aria-label="Save" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                        )}
                    </motion.button>
                </div>
            </div>
            <div className="bottom">
                <p className="caption">
                    <span className="username">{user?.username || 'Unknown User'}</span>
                    {post.caption}
                </p>
            </div>
            
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Comments postId={post._id} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Post