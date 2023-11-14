import React from 'react';
import Topbar from '../../components/Topbar/Topbar.js';
import Sidebar from '../../components/Sidebar/Sidebar.js';
import Feed from '../../components/Feed/Feed';
import Rightbar from '../../components/Rightbar/Rightbar.js';
import {PostContextProvider} from './../../Context/PostContext/PostContext.js';
import './home.css';

const Home = () => {

  return (
    <>
    <PostContextProvider>
      <Topbar/>
        <div className="homeContainer">
          <Sidebar/>
          <Feed/>
          <Rightbar/>
      </div>
    </PostContextProvider>
    </>

  )
}

export default Home
