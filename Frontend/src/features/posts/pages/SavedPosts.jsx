import React, { useEffect, useState } from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import { getSavedPosts } from '../services/post.api'
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

    const handleSaveToggle = (postId, isNowSaved) => {
        if (!isNowSaved) {
            setSavedPosts(prevPosts => prevPosts.filter(p => p._id !== postId))
        }
    }

    if(loading || !savedPosts) {
        return (<main><h1>Loading saved posts...</h1></main>)
    }

    if(savedPosts.length === 0) {
        return (<main><h1>You haven't saved any posts yet</h1></main>)
    }

    return (
        <PageWrapper>
            <main className='feed-page'>
                <div className="feed">
                    <motion.div 
                        className="posts"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {savedPosts.map(post => {
                            return (
                                <motion.div key={post._id} variants={itemVariants}>
                                    <Post user={post.user} post={post} onSaveToggle={handleSaveToggle} />
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </main>
        </PageWrapper>
    )
}

export default SavedPosts
