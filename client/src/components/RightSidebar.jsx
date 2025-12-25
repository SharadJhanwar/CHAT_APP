import React from 'react'
import assets, { imagesDummyData } from '../assets/assets'

const RightSidebar = ({ selectedUser, setSelectedUser }) => {
  return selectedUser && (
    <div className={`bg-black/20 border-l border-gray-700 text-white w-full relative flex flex-col h-full ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className='flex-1 overflow-y-auto px-6 py-10'>
        <div className='flex flex-col items-center gap-3 text-center'>
          <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""
            className='w-24 h-24 rounded-full object-cover border-2 border-gray-600'
          />
          <div>
            <h1 className='text-xl font-semibold flex items-center justify-center gap-2'>
              {selectedUser.fullName}
              <span className='w-2 h-2 rounded-full bg-green-500'></span>
            </h1>
            <p className='text-sm text-gray-400 mt-1'>{selectedUser.bio || "No bio available"}</p>
          </div>
        </div>

        <hr className='border-gray-700 my-8' />

        <div className='text-sm flex-1'>
          <p className="font-medium mb-4 text-gray-300">Shared Media</p>
          <div className='grid grid-cols-3 gap-2 opacity-80'>
            {imagesDummyData && imagesDummyData.map((url, index) => (
              <div key={index} onClick={() => window.open(url)} className='aspect-square cursor-pointer rounded-lg overflow-hidden border border-gray-700 hover:border-violet-500 transition-all'>
                <img src={url} alt="" className='w-full h-full object-cover' />
              </div>
            ))}
          </div>
          {(!imagesDummyData || imagesDummyData.length === 0) && (
            <p className="text-center text-gray-500 py-4">No media shared yet</p>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-gray-700">
        <button
          onClick={() => setSelectedUser(null)}
          className='w-full py-3 bg-gray-100/10 hover:bg-gray-100/20 text-white rounded-lg transition-all text-sm font-medium'
        >
          Close Profile
        </button>
      </div>
    </div>
  )
}


export default RightSidebar