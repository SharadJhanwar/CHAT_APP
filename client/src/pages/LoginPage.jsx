import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login, axios, authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) navigate('/');
  }, [authUser, navigate]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currState === 'Sign Up' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    try {
      if (currState === "Login") {
        await login(email, password);
      } else {
        const { data } = await axios.post("/api/auth/register", {
          fullName, email, password, bio
        });
        if (data.success) {
          toast.success("Account created! Please login.");
          setCurrState("Login");
          setIsDataSubmitted(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl bg-[url("./assets/bgImage.svg")]'>

      {/*Left Side */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />


      {/* Right Side */}

      <form onSubmit={onSubmitHandler} action="" className='border-2 bg-black/40 text-white border-gray-600 p-8 flex flex-col gap-6 rounded-2xl shadow-2xl backdrop-blur-md w-full max-w-md'>

        <h2 className='font-bold text-3xl flex justify-between items-center bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent'>
          {currState}
          {isDataSubmitted && <img onClick={() => {
            setIsDataSubmitted(false)
          }}
            src={assets.arrow_icon} alt="arrow_icon" className='w-5 cursor-pointer invert' />}
        </h2>

        {currState === "Sign Up" && !isDataSubmitted && (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 ml-1">Full Name</label>
            <input
              onChange={(e) => { setFullName(e.target.value) }}
              value={fullName}
              type="text" className='p-3 bg-gray-100/10 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 text-white' placeholder='Your Full Name' required />
          </div>
        )}

        {!isDataSubmitted && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400 ml-1">Email Address</label>
              <input
                onChange={(e) => { setEmail(e.target.value) }}
                value={email}
                type="email" placeholder='Email Address...' className='p-3 bg-gray-100/10 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 text-white' required />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400 ml-1">Password</label>
              <input
                onChange={(e) => { setPassword(e.target.value) }}
                value={password}
                type="password" placeholder='Enter password...'
                className='p-3 bg-gray-100/10 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 text-white' required
              />
            </div>
          </>
        )}
        {currState === 'Sign Up' && isDataSubmitted && (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 ml-1">Tell us about yourself</label>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={4} className='p-3 bg-gray-100/10 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 text-white' placeholder='Provide a short bio...'></textarea>
          </div>
        )}

        <button type="submit" className='py-4 mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-violet-500/20 active:scale-95 transition-all hover:opacity-90'>
          {currState === 'Sign Up' ? (isDataSubmitted ? 'Create Account' : 'Next') : 'Login Now'}
        </button>

        {currState === 'Sign Up' && !isDataSubmitted && (
          <div className='flex items-center gap-2 text-xs text-gray-400'>
            <input type="checkbox" required className="accent-violet-500" />
            <p>Agree to the terms of use & privacy policy </p>
          </div>
        )}


        <div className='flex flex-col gap-2 items-center'>
          {currState == "Sign Up" ? (
            <p className='text-sm text-gray-400'>Already Have an Account?
              <span onClick={() => {
                setCurrState("Login"); setIsDataSubmitted(false)
              }} className='ml-2 font-bold text-violet-400 cursor-pointer hover:underline'>Login Here</span></p>
          ) : (
            <p className='text-sm text-gray-400'>Don't have an account? <span
              onClick={() => {
                setCurrState("Sign Up"); setIsDataSubmitted(false)
              }}
              className='ml-2 font-bold text-violet-400 cursor-pointer hover:underline'>Click Here</span></p>
          )}
        </div>
      </form >
    </div >
  )
}

export default LoginPage
