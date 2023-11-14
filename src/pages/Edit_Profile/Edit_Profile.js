import "./edit_profile.css";
import FormSource  from "../../formSource";
import ProfileTopbar from '../../components/ProfileTopbar/ProfileTopbar'
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useContext } from "react";
import { AuthContext } from '../../Context/AuthContext/AuthContext';
import { Link } from 'react-router-dom';
import axios from "axios";



const EditInfo = () => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const {user, dispatch} = useContext(AuthContext);
  const username = user.result.username;
  const formSource = FormSource();
  const coverPicture = user.result.coverPicture;

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };


  const handleCancelClick = () => {
    setInfo(null);
    // window.location.replace("/");
    // window.location.replace(`/profile/${username}`);
  };




  const handleClick = async (e) => {
    e.preventDefault();

      if(file){
        const data= new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
    
        try {
        const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dpyzwx4t8/image/upload", data);
        const { url } = uploadRes.data;
        const _id = user.result._id;
    
        const post = {
          ...info,
          _id,
          coverPicture: url
        };
    
        await axios.put(`/users/${user.result._id}`, {...post} );
        window.location.replace(`/profile/${user?.result?.username}`);
        localStorage.clear();
        window.location.replace("/");
    
        } catch (error) {
          console.log(error)
        };

      }else{

        try {
          const _id = user.result._id;
          const post = {
            ...info,
            _id,

          };
          await axios.put(`/users/${user.result._id}`, {...post} );
          window.location.replace(`/profile/${user?.result?.username}`);
          localStorage.clear();
          window.location.replace("/");
      
          } catch (error) {
            console.log(error)
          }
      }
    };


  return (
    <div className="new3">
      {/* <Sidebar /> */}
      <div className="newContainer3">
        <ProfileTopbar/>
        <div className="top3">
          <h1>{user?.result?.username} Profile</h1>
        </div>
        <div className="bottom3">
          <div className="left3">
            <img
              className="infoImg"
              src={
                file
                  ? URL.createObjectURL(file)
                  : (coverPicture)
              }
              alt=""
            />
          </div>
          <div className="uright3">
            <form className="infoform">
              <div className="uformInput3">
                <label className="iconlabel" htmlFor="file">
                  CoverPicture: <DriveFolderUploadOutlinedIcon className="icon3" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {formSource.map((input) => (
                <div className="uformInput3" key={input.id}>
                  <label className="labelinfo">{input.label}</label>
                  <input
                    className="inputinfo"
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}
              <div className="doubleBtn">
                <button className="infobtn12" onClick={handleCancelClick}><Link to={`/profile/${username}`} style={{textDecoration:"none"}} className="linklink">Cancel</Link></button>
                <button className="infobtn123" onClick={handleClick}>Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInfo;