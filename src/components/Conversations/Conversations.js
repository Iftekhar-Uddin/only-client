import React, { useEffect, useState } from 'react'
import './conversations.css'
import axios from 'axios'

const Conversations = ({conversation, currentUser}) => {
  const local_storage = process.env.REACT_APP_LOCAL_STORAGE;
  const [user, setUser] = useState({});

  useEffect(() => {
    const friendId = conversation.members.find((m) =>( m !== currentUser._id));
    const getUser = async () => {
    try {
      const res = await axios.get('/users?userId=' + friendId);
      setUser(res.data)
    } catch (error) {
      console.log(error)
    }
   };
   getUser();
  }, [conversation, currentUser]);

  console.log(user)

  return (
    <div className='conversations'>
      <img className="conversationImg" src={local_storage + "/noProfile.png" || user.profilePicture} alt=""/>
      <p className="conversationsName">{user.username}</p>
    </div>
  )
}

export default Conversations
