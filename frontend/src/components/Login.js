import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { toast } from 'react-toastify';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
const Login = () => {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
    
        if (!email || !password) {
            return handleError('Email and password are required');
        }
    
        try {
            const url = `http://localhost:4000/api/auth/login`;
            
            // Use axios to make the POST request
            const response = await axios.post(url, loginInfo, {
                headers: { 'Content-Type': 'application/json' }
            });
            
            const { success, message, jwtToken, name, error } = response.data;
            
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('loggedInEmail', email);

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else {
                handleError(message);
            }
    
            console.log(response.data);
        } catch (err) {
            handleError(err.message || err);
        }
    };

    const handleGoogleLogin = async (credentialResponseDecoded) => {
        try {
            // Extract email from the decoded response
            const emailData = { email: credentialResponseDecoded.email };
            
            // Send a POST request to the backend Google login route
            const response = await axios.post('http://localhost:4000/api/auth/gooleLogin', emailData, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            const { message, user, jwtToken } = response.data;
    
            if (message === "Google Login") {
                // If login is successful, store the token and user info in localStorage
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', user.name);
                
                // Navigate to the dashboard
                navigate('/dashboard');
            } else if (message === "Invalid User") {
                // If user is not registered, navigate to the registration page with their email
                navigate(`/register/${emailData.email}`);
                toast("User is not registered. Please sign up.");
            }
        } catch (err) {
            // Handle errors, display a message if there's an issue
            handleError(err.response?.data?.message || err.message || "Something went wrong");
        }
    };

  

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem', textAlign: 'start' }}>
            <h2 style={{ marginBottom: '1rem', color: '#007bff' }}>Log In</h2>
            <div style={{ border: '2px solid #007bff', borderRadius: '8px', padding: '1rem' }}>
                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={loginInfo.email}
                            required
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                marginTop: '0.25rem',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            value={loginInfo.password}
                            required
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                marginTop: '0.25rem',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                        }}
                    >
                        Log In
                    </button>
                </form>

                <div style={{ margin: '1rem 0', textAlign: 'center' }}>
                    <span>Don't have an account? </span>
                    <a href="/signup" style={{ color: '#007bff', textDecoration: 'underline' }}>Sign Up</a>
                </div>

                <div style={{ width: '40%', margin: 'auto', marginTop: '1rem' }}>
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            const credentialResponseDecoded = jwtDecode(credentialResponse.credential);

                            console.log('Decoded Google Credential:', credentialResponseDecoded);

                            if (credentialResponseDecoded) {
                                handleGoogleLogin(credentialResponseDecoded);
                            } else {
                                console.log("Google credential decoding failed");
                                handleError("Google credential decoding failed");
                            }
                        }}
                        onError={() => {
                            console.log("Google Login Failed");
                            handleError("Google Login Failed");
                        }}
                    />
                </div>
            </div>
        </div>
    
    );
};

export default Login;
