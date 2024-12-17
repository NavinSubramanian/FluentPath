import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useContext } from 'react';
const Getstarted = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [formdata,setFormdata]=useState({})
    useEffect(()=>{
        const sign_in_btn = document.querySelector("#sign-in-btn");
        const container = document.querySelector(".container");

        sign_in_btn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
        });
    },[])
    const handleinput=(event)=>{
        const {name,value}=event.target
        setFormdata((prevdata)=>({
            ...prevdata,
            [name]:value
        }))
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        console.log(email,password)
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            console.log(response.data.success)
            if (response.data.success) {
                const { token, isAdmin } = response.data;
                Cookies.set('token', token, { expires: 1, sameSite: 'Strict' }); // Store token in cookies
                Cookies.set('email', email, { expires: 1, sameSite: 'Strict' }); // Store email in cookies
                Cookies.set('isAdmin', isAdmin, { expires: 1, sameSite: 'Strict' }); // Store isAdmin status
    
                navigate('/'); // Navigate to profile page after successful login
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response);
            } else {
                setError('Failed to login');
            }
            alert("error occured or invalid credential")
        }
    };

    const handlesubmit=(event)=>{
        event.preventDefault();
        console.log(formdata)
    }
    return (
        <>
            <div class="container">
                <div class="forms-container">
                    <div class="signin-signup">
                        <form action="#" class="sign-in-form" onSubmit={handleLogin}>
                            <h2 class="title">Sign in</h2>
                            <div class="input-field">
                                <i class="fas fa-user"></i>
                                <input type="text" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div class="input-field">
                                <i class="fas fa-lock"></i>
                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <input type="submit" value="Login" class="btn solid" />
                        </form>
                        <form action="#" class="sign-up-form">
                            <h2 class="title">Sign up</h2>
                            <div class="input-field">
                                <i class="fas fa-user"></i>
                                <input type="text" placeholder="Username" />
                            </div>
                            <div class="input-field">
                                <i class="fas fa-envelope"></i>
                                <input type="email" placeholder="Email" />
                            </div>
                            <div class="input-field">
                                <i class="fas fa-lock"></i>
                                <input type="password" placeholder="Password" />
                            </div>
                            <input type="submit" class="btn" value="Sign up" />
                        </form>
                    </div>
                </div>

                <div class="panels-container">
                    <div class="panel left-panel">
                        <div class="content">
                            <h3>New to our community ?</h3>
                            <p style={{color:'white'}}>
                                Discover a world of possibilities! Join us and explore a vibrant
                community where ideas flourish and connections thrive.
                            </p>
                        </div>
                        <img  src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png" class="image" alt="" />
                    </div>
                    <div class="panel right-panel">
                        <div class="content">
                            <h3>One of Our Valued Members</h3>
                            <p>
                                Thank you for being part of our community. Your presence enriches our
                shared experiences. Let's continue this journey together!
                            </p>
                            <button class="btn transparent" id="sign-in-btn">
                                Sign in
                            </button>
                        </div>
                        <img src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png"  class="image" alt="" />
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Getstarted;