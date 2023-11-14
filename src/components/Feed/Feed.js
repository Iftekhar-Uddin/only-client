import React, { useContext, useEffect, useState, useReducer } from 'react'
import axios from 'axios'
import './feed.css'
import Share from '../Share/Share.js'
import Post from '../Post/Post.js'
import { AuthContext } from '../../Context/AuthContext/AuthContext'
import { PostContext } from '../../Context/PostContext/PostContext'


const Feed = () =>  {
  const {user} = useContext(AuthContext);
  const [postes, setPostes] = useState({})
  const {posts, dispatch} = useContext(PostContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("posts/timeline/" + user.result._id);
        setPostes(
          res.data.sort((p1, p2) => (
            new Date(p2.createdAt) - new Date(p1.createdAt)
        )));
        dispatch({ type: "FETCH_ALL", payload: res.data});
      } catch (error) {
        console.log(error)
      }
    };
    fetchPosts();
  },[user?.result?._id, dispatch]);


  return (
    <div className="feed">
      <div className="feedWrapper"/>
      <Share/>
      {posts?.map((p) => (
        <Post key={p._id} post={p}/>
      ))}
    </div>
  )
}

export default Feed;


// const localaxios = alternateAxios();