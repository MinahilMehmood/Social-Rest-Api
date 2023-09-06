import { useRef } from 'react';
import './register.css';
import axios from "axios";

const Register = () => {

    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Passwords don't match!");
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            }
            try {
                await axios.post("/auth/register", user);
                window.location.replace("/login");
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className='login'>
            <div className='login-wrapper'>
                <div className='login-left'>
                    <h3 className='login-logo'>Minasocial</h3>
                    <span className='login-desc'>Connect with friends and the world around you on Minasocial.</span>
                </div>
                <div className='login-right'>
                    <form onSubmit={handleSubmit} className='login-box'>
                        <input type='text' required className='login-input' placeholder='Username' ref={username} />
                        <input type='email' required className='login-input' placeholder='Email' ref={email} />
                        <input type='password' required minLength={6} className='login-input' placeholder='Password' ref={password} />
                        <input type='password' required minLength={6} className='login-input' placeholder='Password Again' ref={passwordAgain} />
                        <button className='login-button' type='submit'>Sign Up!</button>
                        <button className='login-register'>Log into your Account!</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
