import React, {useContext, useState, useEffect} from 'react';
import './profileTopbar.css';
import decode from 'jwt-decode';
import {Search, Person, Chat, Notifications} from '@material-ui/icons';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext/AuthContext';


const Topbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {dispatch} = useContext(AuthContext);
    const [user, setUser] = useState(useContext(AuthContext));

    const logout = () => {
        dispatch({type: "LOGOUT"});
        localStorage.clear();
        navigate('/');
        setUser(null);
        window.location.reload();
    }

    useEffect(() =>{
        if(user){
          const token = user.token;
          if(token){
            const decodedToken = decode(token)
            if(decodedToken.exp * 1000 < new Date().getTime()) logout();
          }
        }
    },[location]);
  
  return (
    <div className="topbarContainer">

        <div className="topbarLeft">
            <Link to="/" style={{textDecoration: "none", color: "white"}}>
                <span className='topbarLink'>Homepage</span>
            </Link>
        </div>

        <div className="topbarCenter">
            <div className='searchBar'>
                {/* <Search className="searchIcon"/> */}
                <input className="searchInput" placeholder='Search for friend and media'/>
            </div>
        </div>

        <div className="topbarRight">
            <div className="topbarLinks">
                <Link to="/" style={{textDecoration: "none", color: "black"}}>
                    <span className='topbarLink1'>Homepage</span>
                </Link>
                <span className='topbarLink2'>Timeline</span>
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
            <button className="logoutButton" onClick={logout}><img className="logoutbtnpic" src="https://icon-library.com/images/logout-icon-png/logout-icon-png-26.jpg" alt=''/></button>
        </div>
    </div>
  )
};

export default Topbar;