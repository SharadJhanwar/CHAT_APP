import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = ({ setSelectedUser, selectedUser }) => {
  const { authUser, socket, axios } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const scrollEnd = useRef();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${selectedUser._id}`);
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        toast.error("Error fetching messages");
      }
    };
    if (selectedUser) getMessages();
  }, [selectedUser, axios]);

  useEffect(() => {
    if (socket && selectedUser) {
      socket.on("newMessage", (newMessage) => {
        if (newMessage.senderId === selectedUser._id) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });
      return () => socket.off("newMessage");
    }
  }, [socket, selectedUser]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, {
        text,
        image
      });
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
        setText("");
        setImage(null);
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 4) {
      toast.error("Image size should be less than 4MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
    };
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} alt="Logo.png" className="max-w-16" />
        <p className="text-lg font-medium text-white">Chat Anytime, Anywhere</p>
      </div>
    )
  }

  return (
    <div className="h-full relative backdrop-blur-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-lg text-white font-medium flex items-center gap-2">
            {selectedUser.fullName}
          </p>
        </div>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="Help" className="max-md:hidden max-w-5" />
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.map((msg) => {
          const isSentByMe = String(msg.senderId) === String(authUser._id);

          return (
            <div
              key={msg._id}
              className={`flex w-full ${isSentByMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end gap-3 max-w-[75%] ${isSentByMe ? 'flex-row' : 'flex-row-reverse'}`}>

                <div className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'}`}>
                  {msg.image && (
                    <div className='mb-2 rounded-2xl overflow-hidden border border-gray-700 shadow-lg'>
                      <img src={msg.image} alt="" className='max-w-full block' />
                    </div>
                  )}
                  {msg.text && (
                    <div className={`p-3 px-4 rounded-2xl shadow-sm ${isSentByMe
                        ? 'bg-violet-600 text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700'
                      }`}>
                      <p className='text-sm leading-relaxed'>{msg.text}</p>
                    </div>
                  )}
                  <span className='text-[10px] text-gray-500 mt-1.5 px-1'>
                    {formatMessageTime(msg.createdAt)}
                  </span>
                </div>

                <img
                  src={isSentByMe ? (authUser.profilePic || assets.avatar_icon) : (selectedUser.profilePic || assets.avatar_icon)}
                  alt=""
                  className='w-8 h-8 rounded-full object-cover border border-gray-700 flex-shrink-0'
                />
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>


      {/* Bottom Area */}
      <div className='p-3 bg-black/20'>
        {image && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img src={image} alt="Preview" className="w-16 h-16 object-cover rounded-md border border-gray-600" />
              <button
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          </div>
        )}
        <form onSubmit={handleSendMessage} className='flex items-center gap-3'>
          <div className='flex-1 flex items-center bg-gray-100/10 px-4 rounded-full'>
            <input
              type="text"
              placeholder='Send a message ....'
              value={text}
              onChange={(e) => setText(e.target.value)}
              className='flex-1 text-sm py-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'
            />
            <input
              type="file"
              id="image"
              accept='image/*'
              hidden
              onChange={handleImageChange}
            />

            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="" className='w-5 mr-1 cursor-pointer opacity-70 hover:opacity-100' />
            </label>
          </div>
          <button type="submit" className="disabled:opacity-50">
            <img src={assets.send_button} alt="" className='w-8 cursor-pointer active:scale-95 transition-all' />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatContainer

