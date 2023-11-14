import React, { useContext, useState, useRef} from 'react'
import './share.css';
import { Cancel, EmojiEmotions, Label, PermMedia, Room, Send } from '@material-ui/icons';
import { AuthContext } from '../../Context/AuthContext/AuthContext';
import axios from 'axios';
import { PostContext } from '../../Context/PostContext/PostContext';


const Share = () => {
    const {user} = useContext(AuthContext)
    const {dispatch} = useContext(PostContext);
    const local_storage = process.env.REACT_APP_LOCAL_STORAGE;
    const [file, setFile] = useState(null);
    const [desc , setDesc] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      const postdata = {
        userId: user.result._id,
        desc
      };

      const data= new FormData();
      data.append("file", file);
      data.append("upload_preset", "upload");

      if(file){
        const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dpyzwx4t8/image/upload", data);
        const { url } = uploadRes.data;
        postdata.img = url;

        try {
          await axios.post("/upload", postdata);
        } catch (err){
          console.log(err)
        }
      };

      try{
        await axios.post("/posts", postdata);
        dispatch({ type: "CREATE", payload: postdata});
        setFile(null);
        setDesc("");
        window.location.reload();
        // window.location.reload();
      } catch (err){
        console.log(err)
      };
    };

  return (
    <div className="share">
        <div className="shareWrapper">
            <div className="shareTop">
              <img className="shareProfilePicture" src={user?.result?.profilePicture || local_storage + "/noProfile.png"} alt="/assets/person/1.jpeg"/>
              <input className="shareInput" type="text" value={desc} placeholder={"What's on your mind now "+ user?.result?.username + "?"} onChange={(e) => setDesc(e.target.value)}/>
            </div>
            <hr className="shareHr"/>
            <div className="shareContent">
                {( file &&
                  <>
                    <img className="shareImg" src={URL.createObjectURL(file)} alt=""/>
                    <Cancel className="cancelShareImagehere" onClick={() => setFile(null)}/>
                  </>
                )}
            </div>
            <form className="shareBottom" onSubmit={handleSubmit}>
                <div className="shareOptions">
                    <label htmlFor='file' className="shareOption">
                        <PermMedia className="shareIcon" htmlColor="tomato"/>
                        <span className="shareOptionText">Photo or Video</span>
                        <input style={{display: "none"}} type="file" id="file" accept=".png,.jpg,.jpeg,.svg,.webp" onChange={(e) => setFile(e.target.files[0])}/>
                    </label>
                    <div className="shareOption">
                        <Label className="shareIcon" htmlColor="blue"/>
                        <span className="shareOptionText">Tag</span>
                    </div>
                    <div className="shareOption">
                        <Room className="shareIcon" htmlColor="green"/>
                        <span className="shareOptionText">Location</span>
                    </div>
                    <div className="shareOption">
                        <EmojiEmotions className="shareIcon" htmlColor="goldenrod"/>
                        <span className="shareOptionText">Feelings</span>
                    </div>
                </div>
                <button className="shareButton">
                    <span className="sharePostText" type="submit">Share</span>
                    <Send className="shareButtonicon"/>
                </button>

            </form>
        </div>
    </div>
  )
}

export default Share;
