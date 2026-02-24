import { getFeed } from "../services/post.api"
import { useContext, useCallback } from "react"
import { PostContext } from "../post-context"

export const usePost = () => {

    const context = useContext(PostContext)

    const { loading, setLoading, feed, setFeed } = context

    const handleGetFeed = useCallback(async () => {
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts)
        setLoading(false)
    }, [setLoading, setFeed])

    return { loading, feed, handleGetFeed }

}