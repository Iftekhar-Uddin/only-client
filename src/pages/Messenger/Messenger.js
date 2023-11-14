import React, { useContext, useEffect, useRef, useState } from 'react'
import "./messenger.css"
import axios from 'axios'
import Topbar from '../../components/Topbar/Topbar'
import Conversations from '../../components/Conversations/Conversations'
import Message from '../../components/Message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { AuthContext } from '../../Context/AuthContext/AuthContext'
import {io} from 'socket.io-client'


const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const {user} = useContext(AuthContext);
  const scrollRef = useRef();

  
  useEffect(() => {
    socket.current = io("ws://localhost:7000");
    socket.current.on("getMessages", data => {
      setArrivalMessage({
        text: data.text,
        sender: data.senderId,
        createdAt: Date.now()
      })
    });
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


  console.log(user)
  console.log(onlineUsers)


  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  },[arrivalMessage, currentChat]);



  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user.result._id);
        setConversations(res.data);
      } catch (error) {
        console.log(error)
      }
    };
    getConversations();
  },[user.result._id]);


  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get('/messages/' + currentChat._id);
        setMessages(res.data)
      } catch (error) {
        console.log(error)
      }
    };
    getMessages();
  }, [currentChat?._id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user.result._id,
      text: newMessage,
      conversationId: currentChat._id
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user.result._id
    );

    socket.current.emit("sendMessage", {
      senderId: user.result._id,
      receiverId: receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post('/messages', message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error)
    }
  };


  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  },[messages])

  return (
    <>
    <Topbar/>
    <div className="messenger">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <input className="searchInputMessenger" placeholder="Search for Friends"/>
            {conversations.map((con) => (
              <div onClick={() => setCurrentChat(con)}>
              <Conversations  conversation={con} currentUser={user}/>
              </div>
            ))}
        </div>
      </div>
      <div className="chatBox">
        <div className="chatBoxWrapper">
        { currentChat ? 
          <>
          <div className="chatBoxTop">
            {messages.map((text) => (
              <div ref={scrollRef}>
              <Message message={text} own={text.sender === user.result._id}/>
              </div>
            ))}
          </div>
          <div className="chatBoxBottom">
            <textarea className="chatMessageInput" 
              placeholder="Send your message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}>
              </textarea>
            <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
          </div>
          </> : <span className="conversationBody">Open a conversation to start messaging...</span>
        }
        </div>
      </div>
      <div className="chatOnline">
        <div className="chatOnlineWrapper">
        <ChatOnline onlineUsers={onlineUsers} currentUserId={user.result._id} setCurrentChat={setCurrentChat}/>
        </div>
      </div>
    </div>
    </>
  )
}

export default Messenger
