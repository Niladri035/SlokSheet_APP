import { useContext } from "react";
import { AuthContext } from "../auth-context";
import { login, register } from "../services/auth.api";


export const useAuth = () => {

    const context = useContext(AuthContext)

    const { user, setUser, loading, setLoading, isPrivate, setIsPrivate } = context


    const handleLogin = async (username, password) => {

        setLoading(true)

        const response = await login(username, password)

        setUser(response.user)

        setLoading(false)

    }

    const handleRegister = async (username, email, password) => {

        setLoading(true)
        const response = await register(username, email, password)
        setUser(response.user)

        setLoading(false)

    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const { logout } = await import("../services/auth.api")
            await logout()
            setUser(null)
        } catch (error) {
            console.error("Logout failed:", error)
        } finally {
            setLoading(false)
        }
    }

    return {
        user, loading, handleLogin, handleRegister, handleLogout, isPrivate, setIsPrivate, setUser
    }

}