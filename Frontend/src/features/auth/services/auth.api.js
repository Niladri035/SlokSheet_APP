import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
})

const userApi = axios.create({
    baseURL: "http://localhost:3000/api/users",
    withCredentials: true,
})


export async function login(username, password) {
    const response = await api.post('/login', {
        username, password
    })

    return response.data
}

export async function register(username, email, password) {
    const response = await api.post('/register', {
        username, email, password
    })

    return response.data
}

export async function getMe() {
    const response = await api.get('/get-me')

    return response.data
}

export async function logout() {
    const response = await api.post('/logout')
    return response.data
}

export async function updateProfile(formData) {
    try {
        console.log("Sending update profile request...")
        const response = await userApi.put('/profile', formData)
        console.log("Update profile response:", response.data)
        return response.data
    } catch (error) {
        console.error("Update profile API error:", error.response?.data || error.message)
        throw error
    }
}

export async function getCurrentUser() {
    try {
        console.log("Fetching current user...")
        const response = await userApi.get('/me')
        console.log("Get current user response:", response.data)
        return response.data
    } catch (error) {
        console.error("Get current user API error:", error.response?.data || error.message)
        throw error
    }
}