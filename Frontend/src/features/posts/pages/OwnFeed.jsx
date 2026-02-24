import React, { useEffect, useState } from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import { getOwnFeed } from '../services/post.api'

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
        <main className='feed-page'>
            <div className="feed">
                <div className="posts">
                    {ownFeed.map(post => {
                        return <Post key={post._id} user={post.user} post={post} />
                    })}
                </div>
            </div>
        </main>
    )
}

export default OwnFeed
