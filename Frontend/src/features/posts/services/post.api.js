import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})



export async function getFeed() {
    const response = await api.get('/api/posts/feed')
    return response.data
}

export async function getOwnFeed() {
    const response = await api.get('/api/posts/own-feed')
    return response.data
}

export async function createPost(formData) {
    const response = await api.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export async function likePost(postId) {
    const response = await api.post(`/api/posts/like/${postId}`)
    return response.data
}

export async function unlikePost(postId) {
    const response = await api.delete(`/api/posts/unlike/${postId}`)
    return response.data
}

export async function deletePost(postId) {
    const response = await api.delete(`/api/posts/${postId}`)
    return response.data
}

export async function createComment(postId, text) {
    const response = await api.post(`/api/posts/comment/${postId}`, { text })
    return response.data
}

export async function getComments(postId) {
    const response = await api.get(`/api/posts/comments/${postId}`)
    return response.data
}

export async function deleteComment(commentId) {
    const response = await api.delete(`/api/posts/comment/${commentId}`)
    return response.data
}

export async function savePost(postId) {
    const response = await api.post(`/api/posts/save/${postId}`)
    return response.data
}

export async function unsavePost(postId) {
    const response = await api.delete(`/api/posts/unsave/${postId}`)
    return response.data
}

export async function getSavedPosts() {
    const response = await api.get('/api/posts/saved/posts')
    return response.data
}

export async function togglePrivateAccount() {
    try {
        console.log("Toggling private account...")
        const response = await api.put('/api/posts/privacy/toggle')
        console.log("Toggle private account response:", response.data)
        return response.data
    } catch (error) {
        console.error("Toggle private account API error:", error.response?.data || error.message)
        throw error
    }
}