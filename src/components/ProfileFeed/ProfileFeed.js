import React, { useContext, useEffect, useState } from 'react'
import './profileFeed.css'
import Share from '../Share/Share.js'
import Post from '../Post/Post.js'
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext/AuthContext';


const ProfileFeed = ({username}) =>  {
  const [posts, setPosts] = useState([]);
  const {user} = useContext(AuthContext);

  useEffect(() => {
    const fetchProfileUserData = async () => {
      const res = await axios.get("/posts/profile/" + username)
        setPosts(
          res.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
      )
    };
    fetchProfileUserData()
  }, [username]);


  return (
    <div className="feed">
      <div className="feedWrapper"/>
      { username === user?.result?.username && <Share/>}
      {posts.map((p) => (
        <Post key={p._id} post={p}/>
      ))}
    </div>
  )
}

export default ProfileFeed;