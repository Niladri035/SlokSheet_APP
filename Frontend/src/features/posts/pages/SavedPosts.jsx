import React, { useEffect, useState } from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import { getSavedPosts } from '../services/post.api'

const SavedPosts = () => {
    const [savedPosts, setSavedPosts] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        handleGetSavedPosts()
    }, [])

    const handleGetSavedPosts = async () => {
        setLoading(true)
        try {
            const data = await getSavedPosts()
            setSavedPosts(data.posts)
        } catch {
            console.error("Failed to fetch saved posts")
        } finally {
            setLoading(false)
        }
    }

    if(loading || !savedPosts) {
        return (<main><h1>Loading saved posts...</h1></main>)
    }

    if(savedPosts.length === 0) {
        return (<main><h1>You haven't saved any posts yet</h1></main>)
    }

    return (
        <main className='feed-page'>
            <div className="feed">
                <div className="posts">
                    {savedPosts.map(post => {
                        return <Post key={post._id} user={post.user} post={post} />
                    })}
                </div>
            </div>
        </main>
    )
}

export default SavedPosts
