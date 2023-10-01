import React from 'react'

function MessageSelf(props) {
    //var props2 = {name:"You", message:"This is a simple Message"}
  return (
    <div className='self-message-container'>
        <div className='messageBox'>
            <p>{props.message}</p>
            <p className="self-timeStamp">{}</p>
        </div>
    </div>
  )
}

export default MessageSelf