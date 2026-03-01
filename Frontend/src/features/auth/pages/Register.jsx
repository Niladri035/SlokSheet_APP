import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import Hero3D from '../../shared/Hero3D'
import PageWrapper from '../../shared/PageWrapper'
import AuthBackground3D from '../components/AuthBackground3D'

const Register = () => {
    const { loading, handleRegister } = useAuth()

    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister(username, email, password)
        navigate('/')
    }

    if (loading) {
        return (<main className="login-main"><h1>Loading....</h1></main>)
    }

    return (
        <PageWrapper>
            <AuthBackground3D />
            <main className="login-main auth-split-layout">
                <div className="hero-3d-wrapper">
                    <Hero3D />
                </div>
                <div className="auth-content">
                    <div className="form-container">
                        <div className="logo">Sloksheet</div>
                        <h1>Register</h1>
                        <p style={{
                            color: "#A8A8A8", 
                            fontSize: "0.95rem", 
                            textAlign: "center", 
                            marginBottom: "1rem", 
                            fontWeight: "600",
                            padding: "0 10px"
                        }}>
                            Sign up to see photos and videos from your friends.
                        </p>
                        <form onSubmit={handleSubmit} >
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email" name='email' id='email' placeholder='Email address' />
                            <input
                                onChange={(e) => { setUsername(e.target.value) }}
                                type="text" name='username' id='username' placeholder='Username' />
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password" name='password' id='password' placeholder='Password' />
                            <button className='button primary-button' >Sign up</button>
                        </form>
                    </div>
                    <div className="auth-redirect">
                        <p>Have an account? <Link to={"/login"} >Log in</Link></p>
                    </div>
                </div>
            </main>
        </PageWrapper>
    )
}

export default Register