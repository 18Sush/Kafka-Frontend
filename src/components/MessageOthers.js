import React from 'react';


function MessageOthers(props) {
  const initialCharacter = props.name && props.name.length > 0 ? props.name[0] : '';

  // Check if the message is null or empty
  if (props.message === null || props.message.trim() === '') {
    // Render the file name as the message
    return (
      <div className='other-message-container'>
        <div className='conversation-container'>
          <p className='con-icon'>M</p>
          <div className='other-text-content'>
            <p className='con-title'>{props.name}</p>
            <p className='con-lastMessage'>{props.filename}</p> {/* Use filename here */}
            <p className='self-timeStamp'></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='other-message-container'>
      <div className='conversation-container'>
        <p className='con-icon'>M</p>
        <div className='other-text-content'>
          <p className='con-title'>{props.name}</p>
          <p className='con-lastMessage'>{props.message}</p>
          <p className='self-timeStamp'></p>
        </div>
      </div>
    </div>
  );
}

export default MessageOthers;
