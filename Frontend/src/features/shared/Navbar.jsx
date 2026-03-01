import React, { useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../auth/hooks/useAuth'
import gsap from 'gsap'
import "./navbar.scss"

const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const navRef = useRef(null)

    useEffect(() => {
        if (navRef.current) {
            gsap.fromTo(
                navRef.current.children,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
            )
        }
    }, [])

    const onLogout = async () => {
        await handleLogout()
        navigate("/login")
    }

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-brand">
                    <span className="logo-text">Sloksheet</span>
                </Link>
                <div className="nav-links" ref={navRef}>
                    <Link to="/" className="nav-item">
                        <svg aria-label="Home" color="currentColor" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z"></path></svg>
                        <span className="nav-label">Home</span>
                    </Link>
                    <Link to="/my-posts" className="nav-item">
                        <svg aria-label="Explore" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="24"><polygon points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953" stroke="currentColor"></polygon><circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor"></circle></svg>
                        <span className="nav-label">My Posts</span>
                    </Link>
                    <Link to="/create-post" className="nav-item">
                        <svg aria-label="New post" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="24"><path d="M2.004 22l4-4M22 2.004l-4 4" strokeLinecap="round" strokeLinejoin="round"></path><rect height="18" rx="3" stroke="currentColor" width="18" x="3" y="3"></rect><line x1="12" x2="12" y1="9.004" y2="15.004" strokeLinecap="round" strokeLinejoin="round"></line><line x1="15.004" x2="9.004" y1="12" y2="12" strokeLinecap="round" strokeLinejoin="round"></line></svg>
                        <span className="nav-label">Create</span>
                    </Link>
                    <Link to="/saved-posts" className="nav-item">
                        <svg aria-label="Saved" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="24"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor"></polygon></svg>
                        <span className="nav-label">Saved</span>
                    </Link>
                    <Link to="/profile" className="nav-item">
                        <svg aria-label="Profile" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="24"><circle cx="12" cy="7" r="4" stroke="currentColor"></circle><path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" stroke="currentColor"></path></svg>
                        <span className="nav-label">Profile</span>
                    </Link>
                    
                    {user ? (
                        <div onClick={onLogout} className="nav-item" style={{ cursor: "pointer", marginTop: "auto" }}>
                            <svg aria-label="Log Out" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <span className="nav-label">Log out</span>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-item" style={{ marginTop: "auto" }}>
                            <svg aria-label="Log In" color="currentColor" fill="none" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <span className="nav-label">Log in</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
