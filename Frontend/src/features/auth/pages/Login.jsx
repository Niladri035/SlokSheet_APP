import React, { useState } from 'react'
import "../style/form.scss"
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import Hero3D from '../../shared/Hero3D'
import PageWrapper from '../../shared/PageWrapper'
import AuthBackground3D from '../components/AuthBackground3D'

const Login = () => {

    const { loading, handleLogin } = useAuth()

    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin(username, password)
        navigate('/')
    }

    if (loading) {
        return (<main className="login-main"><h1>Logging you in...</h1></main>)
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
                        <h1>Login</h1>
                        <form onSubmit={handleSubmit} >
                            <input
                                onInput={(e) => { setUsername(e.target.value) }}
                                type="text"
                                name='username'
                                id='username'
                                placeholder='Phone number, username, or email' />
                            <input
                                onInput={(e) => { setPassword(e.target.value) }}
                                type="password"
                                name='password'
                                id='password'
                                placeholder='Password' />
                            <button className='button primary-button' >Log in</button>
                        </form>
                    </div>
                    <div className="auth-redirect">
                        <p>Don't have an account? <Link to={"/register"} >Sign up</Link></p>
                    </div>
                </div>
            </main>
        </PageWrapper>
    )
}

export default Login