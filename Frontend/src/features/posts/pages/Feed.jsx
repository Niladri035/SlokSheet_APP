import React, { useEffect, useState } from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import { getFeed } from '../services/post.api'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import PageWrapper from '../../shared/PageWrapper'

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
}

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
        <PageWrapper>
            <main className='feed-page' >
                <div className="feed">
                    <motion.div 
                        className="posts"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {feed.map(post=>{
                            return (
                                <motion.div key={post._id} variants={itemVariants}>
                                    <Post user={post.user} post={post} />
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </main>
        </PageWrapper>
    )
}

export default Feed