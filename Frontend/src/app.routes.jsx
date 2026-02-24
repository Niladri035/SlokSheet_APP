import { createBrowserRouter } from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Profile from "./features/auth/pages/Profile"
import Feed from "./features/posts/pages/Feed"
import CreatePost from "./features/posts/pages/CreatePost"
import OwnFeed from "./features/posts/pages/OwnFeed"
import SavedPosts from "./features/posts/pages/SavedPosts"
import Layout from "./features/shared/Layout"


export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Feed />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/create-post",
                element: <CreatePost />
            },
            {
                path: "/my-posts",
                element: <OwnFeed />
            },
            {
                path: "/saved-posts",
                element: <SavedPosts />
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
])