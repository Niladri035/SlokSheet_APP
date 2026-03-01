import React, { useState, useEffect, useCallback } from 'react'
import { getComments, createComment, deleteComment } from '../services/post.api'
import "../style/comments.scss"

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [loading, setLoading] = useState(false)

    const fetchComments = useCallback(async () => {
        try {
            const data = await getComments(postId)
            setComments(data.comments)
        } catch {
            console.error("Failed to fetch comments")
        }
    }, [postId])

    useEffect(() => {
        fetchComments()
    }, [postId, fetchComments])

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setLoading(true)
        try {
            await createComment(postId, newComment)
            setNewComment("")
            await fetchComments()
        } catch {
            alert("Failed to add comment")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId)
            await fetchComments()
        } catch {
            alert("Failed to delete comment")
        }
    }

    return (
        <div className="comments-container">
            <div className="comments-list">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment._id} className="comment">
                            <div className="comment-header">
                                <div>
                                    <span className="username">{comment.user.username}</span>
                                    <span className="comment-text">{comment.text}</span>
                                </div>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDeleteComment(comment._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-comments">No comments yet</p>
                )}
            </div>
            
            <form onSubmit={handleAddComment} className="comment-form">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                />
                <button type="submit" disabled={!newComment.trim() || loading}>
                    {loading ? "..." : "Post"}
                </button>
            </form>
        </div>
    )
}

export default Comments
