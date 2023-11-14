import React from 'react'
import './online.css'

const Online = ({activeFriend}) => {
  const local_storage = process.env.REACT_APP_LOCAL_STORAGE;

  return (
    <div className="friendSector">
      <li className= "rightbarFriend">
        <div className='rightbarProfileImgContainer'>
          <img className="rightbarProfileImg" src={local_storage + "noProfile.png" || activeFriend.profilePicture} alt="125.png"/>
          <span className="rightbarOnline"></span>
        </div>
        <span className="rightbarUserName">{activeFriend.username}</span>
      </li>
    </div>
  )
}

export default Online
