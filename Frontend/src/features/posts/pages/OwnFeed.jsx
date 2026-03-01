import React, { useEffect, useState } from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import { getOwnFeed } from '../services/post.api'
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

const OwnFeed = () => {
    const [ownFeed, setOwnFeed] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        handleGetOwnFeed()
    }, [])

    const handleGetOwnFeed = async () => {
        setLoading(true)
        try {
            const data = await getOwnFeed()
            setOwnFeed(data.posts)
        } catch {
            console.error("Failed to fetch own feed")
        } finally {
            setLoading(false)
        }
    }

    if(loading || !ownFeed) {
        return (<main><h1>Loading your posts...</h1></main>)
    }

    if(ownFeed.length === 0) {
        return (<main><h1>You haven't created any posts yet</h1></main>)
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
                        {ownFeed.map(post => {
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

export default OwnFeed
