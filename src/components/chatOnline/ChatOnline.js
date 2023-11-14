import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './chatonline.css'



const ChatOnline = ({onlineUsers, currentUserId, setCurrentChat}) => {
  const local_storage = process.env.REACT_APP_LOCAL_STORAGE;
  const [friends, setFriends] = useState([]);
  const [onlineActiveFriends, setOnlineActiveFriends] = useState([]);

  useEffect(() => {
    const getfriends = async () => {
      const res = await axios.get("/users/friends/" + currentUserId);
      setFriends(res.data)
    }
    getfriends();
  },[currentUserId]);

  console.log(friends)
  console.log(onlineUsers)

  useEffect(() => {
    setOnlineActiveFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(`/conversations/find/${currentUserId}/${user._id}`)
      setCurrentChat(res.data)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="chatOnline">
    {onlineActiveFriends?.map((friend) => (
      <div className="chatOnlineFriend" onClick={()=>{handleClick(friend)}}>
        <div className="chatOnlineImageContainer">
            <img className="chatOnlineImage" src={local_storage + "/noProfile.png" || friend?.profilePicture}  alt=""/>
            <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">{friend?.username}</span>
      </div>
      ))}
    </div>
  )
}

export default ChatOnline
