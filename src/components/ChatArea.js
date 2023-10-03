// ChatArea.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SockJsClient from 'react-stomp';
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import FileDownloadButton from './FileDownloadButton';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

function ChatArea({ user }) {
  // Initialize chatMessages state with messages from localStorage
  const [chatMessages, setChatMessages] = useState(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  });

  const SOCKET_URL = 'http://localhost:9091/ws/';

  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [senderId, setSenderId] = useState(JSON.parse(localStorage.getItem("user")).username); // Replace with the actual sender ID
  const sendFile = async () => {
    try {
      const receiver = user ? user.name:'';// Replace with the actual receiver
      const type = 'FILE';

      const formData = new FormData();
      formData.append('sender', senderId);
      formData.append('receiver', receiver);
      formData.append('type', type);
      formData.append('file', selectedFile);

      const response = await axios.post('http://localhost:9091/api/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('File sent successfully');
      } else {
        console.error('Failed to send file');
      }

      const sentFileMessage = { name: 'You', message: 'File Sent: ' + selectedFile.name, isFile: true, filename: selectedFile.name };
      
      // Update chatMessages state and local storage with the sent message
      addMessage(sentFileMessage);

      setMessage('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error sending file:', error);
    }
  };

  const sendMessage = async () => {
    try {
      const receiver = user ? user.name:''; // Replace with the actual receiver
      const type = 'TEXT';
      setSenderId(JSON.parse(localStorage.getItem("user")).username)
      const formData = new FormData();
      //formData.append('sender', senderId);
      formData.append('sender',JSON.parse(localStorage.getItem("user")).username)
      console.log(senderId)
      formData.append('receiver', receiver);
      formData.append('type', type);
      formData.append('content', message);


      const response = await axios.post('http://localhost:9091/api/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Message sent successfully');
      } else {
        console.error('Failed to send message');
      }

      const sentMessage = { name: 'You', message: message };

      // Update chatMessages state and local storage with the sent message
      addMessage(sentMessage);

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Subscribe to incoming messages when senderId changes
  useEffect(() => {
    const onMessageReceived = (msg) => {
      console.log('Received message:', msg);
      if (msg.sender !== senderId && !isDuplicateFileMessage(msg.filename)) {
        setIncomingMessages([...incomingMessages, msg]);
        showNotification('Received a new message');
        
        // Update chatMessages state and local storage with the received message
        addMessage(msg);
      }
    };


    const client = new SockJsClient(SOCKET_URL);
    client.onConnect = () => {
      console.log('Connected');
      client.subscribe('/topic/group', onMessageReceived);
    };

    client.onDisconnect = () => {
      console.log('Disconnected');
    };

    return () => {
      client.deactivate(); // Cleanup when component unmounts
    };
  }, [senderId]);

  const showNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification('New Message', {
        body: message,
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          new Notification('New Message', {
            body: message,
          });
        }
      });
    }
  };

  useEffect(() => {
    // Request permission for notifications when the component mounts
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const isDuplicateFileMessage = (filename) => {
    return chatMessages.some((msg) => msg.isFile && msg.filename === filename);
  };

  // Function to add a new message to chatMessages and localStorage
  const addMessage = (message) => {
    const updatedMessages = [...chatMessages, message];
    setChatMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
  };

  // When the component unmounts, you can clear the chatMessages from localStorage if needed
  useEffect(() => {
    return () => {
      // Clear chatMessages from localStorage when component unmounts
      localStorage.removeItem('chatMessages');
    };
  }, []);

  return (
    <div className='chatArea-container'>
      <SockJsClient
        url={SOCKET_URL}
        topics={['/topic/group']}
        onConnect={console.log('Connected')}
        onDisconnect={console.log('Disconnected!')}
        onMessage={(msg) => {
          console.log('Received message:', msg);
          setIncomingMessages([...incomingMessages, msg]);
          showNotification('Received a new message');
        }}
        debug={false}
      />
      <div className='chatArea-header'>
        <p className='con-icon'>{user.name[0]}</p>
        <div className='header-text'>
          <p className='con-title'>{user.name}</p>
          <p className='con-timeStamp'>{user.timeStamp}</p>
        </div>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </div>
      <div className='messages-container'>
      {/*Previous code*/}  
        {chatMessages.map((chatMessage, index) => (
          <MessageSelf key={index} name={chatMessage.name} message={chatMessage.message} />
        ))}

        {/*Login applied for one to one message*/}
        {chatMessages.map((chatMessage, index) => {
          const isReceiverMatch = user && chatMessage.receiver === user.name;

          if (isReceiverMatch) {
            return (
              <MessageSelf key={index} name={chatMessage.name} message={chatMessage.message} />
            );
          }})}
          
        {incomingMessages.map((incomingMessage, index) => {
          const isMessageInChat = chatMessages.some((chatMessage) => chatMessage.message === incomingMessage.content);
          
          // Check if the sender's name matches the user's name in the header
    const isSenderMatch = user && incomingMessage.sender === user.name;
    
    // Check if it's not a duplicate file message
    const isNotDuplicateFileMessage = !isDuplicateFileMessage(incomingMessage.fileName);
          
    if (!isMessageInChat && isSenderMatch && isNotDuplicateFileMessage) {
            return (
              <MessageOthers
                key={index}
                name={incomingMessage.sender}
                message={incomingMessage.content}
                file={incomingMessage.fileContent}
                filename={incomingMessage.fileName}
              />
            );
          }

          return null;
        })}
      </div>
      <div className='text-input-area'>
        <input
          placeholder='Type a Message'
          className='search-box'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type='file'
          id='fileInput'
          onChange={(e) => {
            setSelectedFile(e.target.files[0]);
            console.log('text selected' + e.target.files[0]);
          }}
        />
        <IconButton onClick={selectedFile ? sendFile : sendMessage}>
          <SendIcon />
        </IconButton>
        <FileDownloadButton />
      </div>
    </div>
  );
}

export default ChatArea;