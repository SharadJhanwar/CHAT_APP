import React, { useState } from 'react'
import assets from '../assets/assets'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if( currState === 'Sign Up' && !isDataSubmitted){
      setIsDataSubmitted(true);
      return;
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/*Left Side */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />


      {/* Right Side */}

      <form onSubmit={onSubmitHandler} action="" className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>

        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={() => {
            setIsDataSubmitted(false)
          }}
          src={assets.arrow_icon} alt="arrow_icon" className='w-5 cursor-pointer' />}
        </h2>

        {currState === "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(e) => { setFullName(e.target.value) }}
            value={fullName}
            type="text" name="" id="" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name ' required />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => { setEmail(e.target.value) }}
              value={email}
              type="email" name="" id="" placeholder='Email Address...' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required />

            <input
              onChange={(e) => { setPassword(e.target.value) }}
              value={password}
              type="password" name="" id="" placeholder='Enter password...'
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required
            />
          </>
        )}
        {currState === 'Sign Up' && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='provide a short bio...'></textarea>
        )
        }

        <button type="submit" className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:rounded-full hover:rounded-br-none hover:rounded-bl-none hover:translate-y-1 hover:scale-110'>
          {currState === 'Sign Up' ? 'Create Account' : 'Login Now'}
        </button>

        {currState === 'Sign Up' && (
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <input type="checkbox" name="" id="" />
            <p>Agree to the terms of use & privacy policy </p>
          </div>
        )}


        <div className='flex flex-col gap-2'>
          {currState == "Sign Up" ? (
            <p className='text-sm text-gray-600'>Already Have an Account ?
              <span onClick={() => {
                setCurrState("Login"); setIsDataSubmitted(false)
              }} className='pl-2 font-medium text-violet-500 cursor-pointer'>Login Here </span></p>
          ) : (
            <p className='text-sm text-gray-600'>Create an account <span
              onClick={() => {
                setCurrState("Sign Up"); setIsDataSubmitted(false)
              }}
              className='pl-3 font-medium text-violet-500 cursor-pointer'>Click Here</span></p>
          )}
        </div>
      </form >
    </div >
  )
}

export default LoginPage