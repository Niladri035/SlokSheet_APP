import React from 'react'
import { Link } from 'react-router'
import "./navbar.scss"

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-brand">InstaClone</Link>
                <div className="nav-links">
                    <Link to="/">Feed</Link>
                    <Link to="/create-post">Create</Link>
                    <Link to="/my-posts">My Posts</Link>
                    <Link to="/saved-posts">Saved</Link>
                    <Link to="/profile">Profile</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
