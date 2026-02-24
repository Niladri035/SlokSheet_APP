import { useState } from "react";
import { PostContext } from "./post-context";

export const PostContextProvider = ({ children }) => {

    const [ loading, setLoading ] = useState(false)
    const [ post, setPost ] = useState(null)
    const [ feed, setFeed ] = useState(null)
    const [ ownFeed, setOwnFeed ] = useState(null)
    const [ savedPosts, setSavedPosts ] = useState(null)
    const [ comments, setComments ] = useState({})
    const [ isPrivate, setIsPrivate ] = useState(false)


    return (
        <PostContext.Provider value={{ 
            loading, setLoading, 
            post, setPost, 
            feed, setFeed,
            ownFeed, setOwnFeed,
            savedPosts, setSavedPosts,
            comments, setComments,
            isPrivate, setIsPrivate
        }}>
            {children}
        </PostContext.Provider>
    )

}