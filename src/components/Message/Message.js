import React from 'react'
import './message.css'
import moment from 'moment'

const Message = ({message, own}) => {
    const local_storage = process.env.REACT_APP_LOCAL_STORAGE
    return (
      <div className={own ? "message own" : "message"}>
        <div className="mesaageTop">
          <img
            className="messageImg"
            src={local_storage + "/noProfile.png"}
            alt=""
          />
          <p className="messageText">{message.text}</p>
        </div>
        <div className="messageBottom">{moment(message.createdAt).fromNow()}</div>
      </div>
    );
  }

export default Message
