import React, { useContext } from 'react'
import './post.css';
import { MoreHoriz } from '@material-ui/icons';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import moment from 'moment';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext/AuthContext';
import { PostContext } from '../../Context/PostContext/PostContext';
import { Cancel} from '@material-ui/icons';


const Post = ({post}) => {
  const local_storage = process.env.REACT_APP_LOCAL_STORAGE;
  const [likes, setLikes] = useState(post.likes);
  const [flag, setflag] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imageUpdate, setImageUpdate] = useState(false);
  const [img, setImg] = useState("")
  const [user, setUser] = useState({});
  const {user: currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(PostContext);
  const [desc, setDesc] = useState("");
  const userId = post.userId;
  const id = post._id;
  const nowUserId = currentUser.result._id

  // console.log(post);
  // console.log(userId);
  // console.log(nowUserId);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`)
      setUser(res.data)
    };
    fetchUser();
  },[post.userId]);

  
  const haslikedpost = post?.likes?.find((like) => like === nowUserId);

  const likeHandler = async () => {
    try {
      const {data} = await axios.patch("/posts/" + id + "/like", {userId: nowUserId});
      dispatch({ type: "LIKE", payload: {id, data, userId}});
      console.log(data);
    } catch (error) {
      console.log(error)
    };

    if(haslikedpost){
      setLikes(post.likes.filter((like) => like !== nowUserId))
    }else{
      setLikes([...post.likes, nowUserId]);
    }
  };

  const LikeCounts = () => {
    if (likes?.length > 0) {
      return likes.find((like) => like === nowUserId)
      ? (
      <>{likes.length > 2 ? `You and ${likes.length -1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
      ) : (
      <>{likes.length} {likes.length === 1 ? 'Like' : 'Likes'} </>
      )
    }
  };


  const handleclickmorehoriz = () => {
    setflag(true);
  }

  const handleEdit = () => {
    setDesc(post?.desc)
    setImg(post?.img);
    setEditMode(true);
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    await axios.delete(`/posts/${id}`);
    dispatch({ type: "DELETE", payload: id});
  }

  const handleCancel = () => {
    setImageUpdate(false);
    setEditMode(false);
    setflag(false);
    setDesc("")
  };


  const handleUpdate = async (e) => {
    e.preventDefault();

    if(img){
    const data= new FormData();
    data.append("file", img);
    data.append("upload_preset", "upload");

    try {
    const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dpyzwx4t8/image/upload", data);
    const { url } = uploadRes.data;

    const post = {
      desc, userId, img:url
    };

    const res = await axios.patch(`/posts/${id}`, {...post} );
    const result = res.data;
    dispatch({ type: "UPDATE", payload: {id, result}});
    setImageUpdate(false);
    setEditMode(false);
    setflag(false);

    } catch (error) {
      console.log(error)
    };

  }else{

    try {
      const post = {
        desc,
        userId,
      };
      const res = await axios.patch(`/posts/${id}`, {...post} );
      const result = res.data
      dispatch({ type: "UPDATE", payload: {id, result}});
      setImageUpdate(false);
      setEditMode(false);
      setflag(false);

      } catch (error) {
        console.log(error)
      }
    }
  };


  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
            <div className="postTopLeft">
              <Link to={`profile/${user.username}`}>
              <img className="postProfile" src={user?.profilePicture || local_storage + "noProfile.png"} alt=""/>
              </Link>
              <div className="Username&Date">
                <div className="postUserName">{user?.username}</div>
                <span className="postDate"> {moment(post?.createdAt).fromNow()}</span>
              </div>
            </div>
            {((currentUser.result._id===post.userId) && <div className="postTopRight">
             <button className="morehoriz" onClick={handleclickmorehoriz}><MoreHoriz/></button>
             {flag && <div className='MoreEditButton'>
             <button className="morehoriz2" onClick={handleDelete}>Delete</button>
             <button className="morehoriz1" onClick={handleEdit}>Edit</button>
             </div>}
            </div>)}
        </div>
        <div className="postCenter">
          {<> {editMode?
            <><input type="text" placeholder={post?.desc} value={desc} autoFocus className="inputofpost" onChange={(e) => setDesc(e.target.value)}/></> :
            <span className="postText">{post?.desc}</span> }
          </>}
          {imageUpdate && <Cancel className="cancelShareImage" onClick={() => (setImg(""), setImageUpdate(false))}/>}
          {editMode ?(
          <>
          {imageUpdate ?
            <img className="postImg" src={img && editMode? (URL.createObjectURL(img)): ("https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg")} alt=""/> :
            <>
            <img className="postImg" src={editMode? (post?.img) : ("https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg")} alt=""/>
            <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" id= "file" onChange={(e) => (setImg(e.target.files[0]), setImageUpdate(true))}/>
            </>
          }
          </>
          ):(
          <>
            <img className="postImg" src={post?.img} alt=""/>
          </>
          )}
        </div>
        <div className="postBottom">
            <div className="postBottomLeft">
                {!editMode &&<> 
                <img className="likeReact" src={local_storage + "/like.png"} onClick={likeHandler} alt="123.jpeg"/>
                <img className="likeReact" src={local_storage + "/heart.png"} onClick={likeHandler} alt="123.jpeg"/>
                <span className="postlikeCounter"><LikeCounts/></span>
                </>}
            </div>
            <div className="postBottomRight">
                {<>
                {!editMode ? <span className="postComment"> {post?.comment} Comment</span> :
                <div className='postcancelupdatebtn'>
                  <button className='cancelpostbtn' onClick={handleCancel}>Cancel</button>
                  <button className='updatepostbtn' onClick={handleUpdate}>Update</button>
                </div>}
                </>}
            </div>
        </div>
      </div>
    </div>
  )
}

export default Post

  // const haslikedpost = post.likes.find((like) => like === currentUser.result._id);

  // const likeHandler = () => {
  //   try {
  //     axios.put("/posts/" + post._id + "/like", {userId: currentUser.result._id});
  //     dispatch({ type: "LIKE", payload: post._id });
  //   } catch (error) {
  //     console.log(error)
  //   };

  //   if(haslikedpost){
  //     setLikes(post.likes.filter((like) => like !== currentUser.result._id))
  //   }else{
  //     setLikes([...post.likes, currentUser.result._id]);
  //   }
  // };




  // return (
  //   <div className="post">
  //     <div className="postWrapper">
  //       <div className="postTop">
  //           <div className="postTopLeft">
  //             <Link to={`profile/${user.username}`}>
  //             <img className="postProfile" src={user?.profilePicture || local_storage + "noProfile.png"} alt="123"/>
  //             </Link>
  //             <div className="Username&Date">
  //               <div className="postUserName">{user?.username}</div>
  //               <span className="postDate"> {moment(post?.createdAt).fromNow()}</span>
  //             </div>
  //           </div>
  //           {((currentUser.result._id===post.userId) && <div className="postTopRight">
  //            <button className="morehoriz" onClick={handleclickmorehoriz}><MoreHoriz/></button>
  //            {flag && <div className='MoreEditButton'>
  //            <button className="morehoriz1" onClick={handleEdit}>Edit</button>
  //            <button className="morehoriz2" onClick={handleDelete}>Delete</button>
  //            </div>}
  //           </div>)}
  //       </div>
  //       <div className="postCenter">
  //         {<> {editMode?
  //           <><input type="text" placeholder = {post?.desc} value={desc} className="inputofpost" onChange={(e) => setDesc(e.target.value)}/></> :
  //           <span className="postText">{post?.desc}</span> }
  //         </>}
  //         {imageUpdate? <>
  //           <img className="shareImg" src={URL.createObjectURL(newFile)} alt=""/>
  //           <Cancel className="cancelShareImage" onClick={() => setImage("")}/>
  //           <label htmlFor='file' className="shareOption"></label>
  //           <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" onChange={(e) => (setImage(e.target.files[0]) )}/>
  //           </>:
  //           <img className="postImg" src={local_storage +post?.img} alt=""/> }
  //       </div>
  //       <div className="postBottom">
  //           <div className="postBottomLeft">
  //               {!editMode &&<> 
  //               <img className="likeReact" src={local_storage + "/like.png"} onClick={likeHandler} alt="123.jpeg"/>
  //               <img className="likeReact" src={local_storage + "/heart.png"} onClick={likeHandler} alt="123.jpeg"/>
  //               </>}
  //               <>{ editMode? 
  //                 (<>
  //                 <button className="imageSelectButton" onClick={ () => {setPostPicture(null); setImageUpdate(true)}}><label htmlFor='file' className="shareOption">Image :<DriveFolderUploadOutlinedIcon className="iconone"/></label></button>
  //                 <input style={{ display: "none" }} type="file" accept=".png,.jpg,.jpeg,.svg,.webp" id= "file" onChange={(e) => (setImage(e.target.files[0]) )}/>
  //                 </>) : (<span className="postlikeCounter"><NewLike/></span>)
  //                 }</>
  //           </div>
  //           <div className="postBottomRight">
  //               {<>
  //               {!editMode ? <span className="postComment"> {post?.comment} Comment</span> :
  //               <div className='postcancelupdatebtn'>
  //                 <button className='cancelpostbtn' onClick={handleCancel}>Cancel</button>
  //                 <button className='updatepostbtn' onClick={handleUpdate}>Update</button>
  //               </div>}
  //               </>}
  //           </div>
  //       </div>
  //     </div>
  //   </div>
  // )