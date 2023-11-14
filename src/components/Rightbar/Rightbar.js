import React from 'react'
import './rightbar.css'
import Online from '../Online/Online'
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext/AuthContext"
import { useContext, useEffect, useState, useRef } from "react"
import {io} from 'socket.io-client'

const Rightbar = () => {
  const local_storage = process.env.REACT_APP_LOCAL_STORAGE;
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const socket = useRef();

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user.result._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  console.log(onlineFriends)

  useEffect(() => {
    socket.current = io("ws://localhost:7000");
  }, []);


  useEffect(() => {
    socket.current.emit("addUser", user.result._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.result.followings.filter((f) => users.some((u) => u.userId === f))
      );
      console.log(users)
    });
  }, [user]);


  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);


  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <div className="birthdayContainer">
          <img className="birthdayImage" src= {local_storage + "gift.png"} alt="123.png"/>
          <span className="birthdayText"> <b>Marina Afrin</b> and <b>2 other friends</b> birthday today.</span>
        </div>
        <img className="rightbarAdd" src= {local_storage + "ad.png"} alt="125.png"/>
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {onlineFriends.map((friend) => (
            <Online key={friend.id} activeFriend={friend} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Rightbar
