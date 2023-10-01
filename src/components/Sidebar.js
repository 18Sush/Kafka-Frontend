// Sidebar.js
import React, { useState, useEffect } from 'react';
import './myStyles.css';
import ConversationsItem from './ConversationsItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NightlightIcon from '@mui/icons-material/Nightlight';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

function Sidebar({ onUserClick }) {
  const [conversations, setConversations] = useState([]);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);

  useEffect(() => {
    const apiUrl = showOnlineUsers
      ? 'http://localhost:8082/api/auth/online-users'
      : 'http://localhost:8082/api/auth/users';

    // Fetch user data from the API
    axios.get(apiUrl)
      .then((response) => {
        const userData = response.data;
        // Extract usernames and store them in an array
        const usernames = userData.map(user => ({
          name: user.username, // Adjust this based on the actual field in your user data
          timeStamp: "yesterday", // You can set this as needed
        }));
        setConversations(usernames);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [showOnlineUsers]);

  return (
    <div className='sidebar-container'>
      <div className='sb-header'>
        <div>
          <IconButton>
            <AccountCircleIcon />
          </IconButton>
        </div>
        <div>
          <IconButton>
            <PersonAddIcon />
          </IconButton>
          <IconButton>
            <GroupAddIcon />
          </IconButton>
          <IconButton>
            <AddCircleIcon />
          </IconButton>
          <IconButton>
            <NightlightIcon />
          </IconButton>
        </div>
      </div>
      <div className='sb-search'>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <input placeholder='search' className='search-box' />
      </div>
      <div className='sb-conversations'>
        <IconButton className="onlineUsersButton" onClick={() => setShowOnlineUsers(!showOnlineUsers)}>
          {showOnlineUsers ? 'Show All Users' : 'Online Users'}
        </IconButton>
        {conversations.map((conversation) => {
          return (
            <ConversationsItem
              props={conversation}
              key={conversation.name}
              onClick={() => onUserClick(conversation)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;