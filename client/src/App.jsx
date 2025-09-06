import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

const App = () => {
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login" style={{ marginLeft: '10px' }}>Login</Link>
        <Link to="/profile" style={{ marginLeft: '10px' }}>Profile</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

export default App
