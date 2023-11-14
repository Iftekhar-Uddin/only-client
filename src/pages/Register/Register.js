import React, { useRef } from 'react'
import './register.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate();
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const RepeatPassword = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password.current.value !== RepeatPassword.current.value){
        password.current.setCustomValidity("Password don't match!")
        }else{
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value
            };
            try {
                await axios.post("/auth/register/", user)
                navigate('/login');
            } catch (error) {
                console.log(error)
            }
        }

    };

    return (
      <div className="register">
          <div className="registerWrapper">
              <div className="registerLeft">
                  <h3 className="registerLogo">Social Media</h3>
                  <span className="registerDesc">Create account & connect each with others</span>
              </div>
              <div className="registerRight">
                  <form className="registerBox" onSubmit={handleSubmit}>
                      <input className="registerInput" required ref={username} placeholder="Username"/>
                      <input className="registerInput" type="email" required ref={email} placeholder="Email"/>
                      <input className="registerInput" minLength="6" type="password" required ref={password} placeholder="Password"/>
                      <input className="registerInput" minLength="6" type="password" required ref={RepeatPassword} placeholder="Repeat Password"/>
                      <button className="registerButton" type="submit" >Sign Up</button>
                      <Link className="registerLink" to="/login">
                      <button className="registerRegister">Log Into Account</button>
                      </Link>
                  </form>
              </div>
          </div>
      </div>
    )
  }

export default Register
