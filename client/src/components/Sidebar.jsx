import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  const { authUser, onlineUsers, logout, axios } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await axios.get("/api/messages/users");
        if (data.success) {
          setUsers(data.users);
          setUnseenMessages(data.unseenMessages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (authUser) getUsers();
  }, [authUser, axios]);

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          {/* Menu */}
          <div className="relative py-2 group">
            <img src={assets.menu_icon} alt="menu" className="max-h-5 cursor-pointer" />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p onClick={() => navigate('/profile')} className="cursor-pointer text-sm">Edit Profile</p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={logout} className="cursor-pointer text-sm font-medium text-red-400">Logout</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* User list */}
      <div className="flex flex-col overflow-y-auto max-h-[calc(100%-140px)]">
        {users.map((user, index) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''
              }`}
          >
            <div className="relative">
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt={user.fullName}
                className="w-[35px] aspect-[1/1] rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1a1c3b] rounded-full"></span>
              )}
            </div>

            <div className="flex flex-col leading-5">
              <p className="font-medium">{user.fullName}</p>
              <span className={`text-xs ${onlineUsers.includes(user._id) ? 'text-green-400' : 'text-neutral-400'}`}>
                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </span>
            </div>

            {unseenMessages[user._id] > 0 && (
              <p className="absolute top-4 right-4 text-[10px] h-4 w-4 flex justify-center items-center rounded-full bg-violet-600 text-white font-bold">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar

