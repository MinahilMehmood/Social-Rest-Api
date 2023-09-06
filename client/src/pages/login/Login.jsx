import { useContext, useRef } from 'react';
import './login.css';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {

    const email = useRef();
    const password = useRef();
    const { isFetching, dispatch } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        loginCall({ email: email.current.value, password: password.current.value }, dispatch)
    };

    return (
        <div className='login'>
            <div className='login-wrapper'>
                <div className='login-left'>
                    <h3 className='login-logo'>Minasocial</h3>
                    <span className='login-desc'>Connect with friends and the world around you on Minasocial.</span>
                </div>
                <div className='login-right'>
                    <form className='login-box' onSubmit={handleSubmit}>
                        <input type='email' className='login-input' required placeholder='Email' ref={email} />
                        <input type='password' className='login-input' minLength={5} required placeholder='Password' ref={password} />
                        <button disabled={isFetching} className='login-button'>{isFetching ? <CircularProgress style={{ color: "white" }} /> : "Log In"}</button>
                        <span className='login-forgot'>Forgot Password?</span>
                        <button className='login-register'>{isFetching ? <CircularProgress style={{ color: "white" }} /> : "Create a New Account!"}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
