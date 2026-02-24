import React, { useEffect, useState } from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import { getFeed } from '../services/post.api'
import { useNavigate } from 'react-router'

const Feed = () => {
    const [feed, setFeed] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        handleGetFeed()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleGetFeed = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getFeed()
            setFeed(data.posts || [])
        } catch (err) {
            console.error("Failed to fetch feed:", err)
            
            // If unauthorized, redirect to login
            if (err.response?.status === 401) {
                navigate('/login')
                return
            }
            
            setError(err.response?.data?.message || err.message || "Failed to load feed")
            setFeed([])
        } finally {
            setLoading(false)
        }
    }

    if(loading) {
        return (<main><h1>Feed is loading...</h1></main>)
    }

    if(error && !error.includes("401")) {
        return (
            <main>
                <div style={{ padding: '2rem', color: '#d20c3d' }}>
                    <h1>Error loading feed</h1>
                    <p>{error}</p>
                    <button onClick={handleGetFeed} className="button primary-button">
                        Retry
                    </button>
                </div>
            </main>
        )
    }

    if(!feed || feed.length === 0) {
        return (<main><h1>No posts yet. Be the first to post!</h1></main>)
    }

    return (
        <main className='feed-page' >
            <div className="feed">
                <div className="posts">
                    {feed.map(post=>{
                        return <Post key={post._id} user={post.user} post={post} />
                    })}
                </div>
            </div>
        </main>
    )
}

export default Feed