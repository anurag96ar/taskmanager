
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
    
        if (!name || !email || !password) {
            return handleError('name, email, and password are required');
        }
    
        try {
            const url = `https://taskmanager-2-pcq2.onrender.com/api/auth/signup`;
            const response = await axios.post(url, signupInfo, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const { success, message, error } = response.data;
    
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(response.data);
            
        } catch (err) {
            handleError(err.response ? err.response.data : err.message);
        }
    };

    return (
        <div style={{ 
            maxWidth: '400px', 
            margin: 'auto', 
            padding: '1rem', 
            textAlign: 'start' 
        }}>
            <h2 style={{ marginBottom: '1rem', color: '#007bff' }}>Sign Up</h2>
            <div style={{ 
                border: '2px solid #007bff', 
                borderRadius: '8px', 
                padding: '1rem' 
            }}>
                <form onSubmit={handleSignup} style={{ width: '100%' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={signupInfo.name}
                            onChange={handleChange}
                            required
                            style={{ 
                                width: '100%', 
                                padding: '0.5rem', 
                                marginTop: '0.25rem', 
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={signupInfo.email}
                            onChange={handleChange}
                            required
                            style={{ 
                                width: '100%', 
                                padding: '0.5rem', 
                                marginTop: '0.25rem', 
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={signupInfo.password}
                            onChange={handleChange}
                            required
                            style={{ 
                                width: '100%', 
                                padding: '0.5rem', 
                                marginTop: '0.25rem', 
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <button type="submit" style={{ 
                        width: '100%', 
                        padding: '0.8rem', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        cursor: 'pointer', 
                        borderRadius: '4px' 
                    }}>
                        Sign Up
                    </button>
                </form>
                <div style={{ margin: '1rem 0', textAlign: 'center' }}>
                    <span>Already have an account? </span>
                    <a href="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>Login</a>
                </div>
                <div style={{ margin: 'auto', marginTop: '1rem', textAlign: 'center' }}>
                    <button 
                        onClick={() => console.log('Sign up with Google')} 
                        style={{ 
                            width: '40%', 
                            padding: '8px',
                            backgroundColor: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            cursor: 'pointer', 
                            borderRadius: '4px'
                        }}>
                        Sign Up with Google
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
        
    );
};

export default Signup;
