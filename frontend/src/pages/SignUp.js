import React from 'react';
import "../css/signup.scss";
import bgimage from "../assets/PeerPrep.png"

function SignUp() {


    return (
        <section>
            <div className='signup-container'>

                <div className='col-2'>
                        <img src={bgimage} alt=""/>
                </div>

                <div className='col-1'>
                    <h2>Sign Up</h2>
                    <span>Get yourself prepared for Tech Interview</span>

                    <form id='form' className='flex flex-col'>
                        <input type='text' placeholder='Username' />
                        <input type='email' placeholder='Email Address' />
                        <input type='password'placeholder='Password' />
                        <input type='password'placeholder='Confirm Password' />
                        
                        
                        <button className='button'>Sign up</button>
                        <div className='forgot-password'>Lost Password? Click <span>here!</span></div>
                    </form>
                </div>

            </div>
            
        </section>
    )
}

export default SignUp;