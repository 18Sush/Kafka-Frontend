// ConversationsItem.js
import React from 'react';

function ConversationsItem({ props, onClick }) {
  

  return (
    <div className='conversation-container'>
      <button className='con-icon' onClick={() => onClick(props)}>
        {props.name[0]}
      </button>
      <button className='con-title' onClick={() => onClick(props)}>
        {props.name}
      </button>
      <p className='con-lastMessage'>{props.lastMessage}</p>
      <p className='con-timeStamp'>{props.timeStamp}</p>
      <div>
        <p className='ip-address'>{props.ipAddress}</p>
      </div>
    </div>
  );
}

export default ConversationsItem;