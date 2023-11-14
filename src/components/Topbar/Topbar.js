import React, {useContext} from 'react';
import {Search, Person, Chat, Notifications} from '@material-ui/icons';
import './topbar.css';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext/AuthContext';
import { PostContext } from '../../Context/PostContext/PostContext';


const Topbar = () => {
  const local_storage = process.env.REACT_APP_LOCAL_STORAGE;
  const { user } = useContext(AuthContext);
  const {posts} = useContext(PostContext);

  console.log(user)

  return (
    <div className="topbarContainer">

        <div className="topbarLeft">
            <Link to='/' style={{textDecoration:"none"}}>
            <span className='logo'>Social Media</span>
            </Link>
        </div>

        <div className="topbarCenter">
            <div className='searchBar'>
                {/* <Search className="searchIcon"/> */}
                <input className="searchInput" placeholder=' Search for friend and media'></input>
            </div>
        </div>

        <div className="topbarRight">
            <div className="topbarLinks">
            <Link to="/" style={{textDecoration: "none", color: "white"}}>
                <span className='topbarLink1'>Homepage</span>
                </Link>
                <span className='topbarLink23'>Timeline</span>
            </div>
            <div className='topbarIcons'>
                <div className='topbarIconItems'>
                    <Person/>
                    <span className="topbarIconBadge">2</span>
                </div>
                <div className='topbarIconItems'>
                    <Link to="/messenger">
                    <Chat style={{color: "white"}}/>
                    </Link>
                    <span className="topbarIconBadge">5</span>
                </div>
                <div className='topbarIconItems'>
                    <Notifications/>
                    <span className="topbarIconBadge">7</span>
                </div>
            </div>
            <div>
                <Link to={`/profile/${user?.result?.username}`}>
                <img className="topbarImg" src={ user? user?.result?.profilePicture : local_storage + "/noProfile.png"} alt="1.jpeg" />
                </Link>
            </div>
        </div>
    </div>
  )
};

export default Topbar;
