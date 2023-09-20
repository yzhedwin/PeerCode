import React from 'react';
import "../css/login.scss";
import bgimage from "../assets/PeerPrep.png"

function Login() {


    return (
        <section>
            <div className='login-container'>

                <div className='col-2'>
                        <img src={bgimage} alt=""/>
                </div>

                <div className='col-1'>
                    <h2>Login</h2>
                    <span>Get yourself prepared for Tech Interview</span>

                    <form id='form' className='flex flex-col'>
                        <input type='email' placeholder='Email Address' />
                        <input type='password'placeholder='Password' />
                        
                        
                        <button className='button'>Login</button>
                        <div className='forgot-password'>Lost Password? Click <span>here!</span></div>
                    </form>
                </div>

            </div>
            
        </section>
    )
}

export default Login;