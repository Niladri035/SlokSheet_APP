import React from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router'

const pageVariants = {
    initial: {
        opacity: 0,
        y: 10
    },
    in: {
        opacity: 1,
        y: 0
    },
    out: {
        opacity: 0,
        y: -10
    }
}

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
}

const PageWrapper = ({ children }) => {
    const location = useLocation()
    
    return (
        <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}
        >
            {children}
        </motion.div>
    )
}

export default PageWrapper
