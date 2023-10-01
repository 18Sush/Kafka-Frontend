import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

function MainContainer() {
  const [selectedUser, setSelectedUser] = useState(null);

  const chatProps = {
    name: '',
    timeStamp: "today",
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className='main-container'>
      <Sidebar onUserClick={handleUserClick} />
      {selectedUser ? <ChatArea user={selectedUser} /> : null}
    </div>
  );
}

export default MainContainer;