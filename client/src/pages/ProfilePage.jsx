import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, axios, checkAuth } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName);
      setBio(authUser.bio);
    }
  }, [authUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImg(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/auth/update-profile", {
        fullName: name,
        bio,
        profilePic: selectedImg
      });
      if (data.success) {
        toast.success("Profile updated!");
        await checkAuth();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  }

  return (
    <div className='min-h-screen bg-slate-950 flex items-center justify-center p-4 bg-[url("./assets/bgImage.svg")] bg-cover'>
      <div className='w-full max-w-2xl bg-black/40 backdrop-blur-xl text-gray-300 border border-gray-700 flex items-center justify-between max-sm:flex-col-reverse rounded-2xl shadow-2xl overflow-hidden'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-10 flex-1'>
          <h3 className='text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent'>Profile Details</h3>

          <div className="flex flex-col items-center sm:items-start gap-4">
            <label htmlFor="avatar" className='relative cursor-pointer group'>
              <input
                onChange={handleImageChange}
                type="file" id="avatar" accept='image/*' hidden />
              <div className="relative w-24 h-24">
                <img
                  src={selectedImg || authUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className='w-full h-full rounded-2xl object-cover border-2 border-gray-600 group-hover:border-violet-500 transition-all'
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-2xl">
                  <p className="text-[10px] font-bold">CHANGE</p>
                </div>
              </div>
            </label>
            <p className="text-sm text-gray-500">Click to upload new avatar</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 ml-1">Full Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text" required placeholder='Your name'
              className='p-3 bg-gray-100/10 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 text-white'
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 ml-1">Bio</label>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={3}
              className='p-3 bg-gray-100/10 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 text-white resize-none'
              placeholder='Write something about yourself...'
              required
            ></textarea>
          </div>

          <button type='submit' className='bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-lg text-lg font-bold shadow-lg shadow-violet-500/20 active:scale-95 transition-all hover:opacity-90 mt-2'>
            Save Profile
          </button>
        </form>
        <div className="p-10 max-sm:pb-0">
          <img src={assets.logo} className='max-w-40 opacity-80' alt="" />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
