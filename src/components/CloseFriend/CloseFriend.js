import React from 'react'
import './closefriend.css'


const CloseFriend = ({user}) => {
  const local_storage = process.env.REACT_APP_LOCAL_STORAGE;
  return (
    <li className="sidebarFriend">
    <img className="sidebarFriendImg" src={local_storage + "noProfile.png" || user?.profilePicture} alt=""/>
    <span className="sidebarFriendName">{user.username}</span>
  </li>
  )
}

export default CloseFriend
