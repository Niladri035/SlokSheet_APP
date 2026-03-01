import React from 'react'
import { Outlet, useLocation } from 'react-router'
import Navbar from './Navbar'
import { AnimatePresence } from 'framer-motion'
import Background3D from './Background3D'

const Layout = () => {
    const location = useLocation()
    
    return (
        <div className="app-layout">
            <Background3D />
            <Navbar />
            <div className="main-content" style={{ zIndex: 1, backgroundColor: 'transparent' }}>
                <AnimatePresence mode="wait">
                    <div key={location.pathname} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <Outlet />
                    </div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Layout
