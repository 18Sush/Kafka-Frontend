import React, { Component } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import ChatService from "../services/chat.service";
import DeadLetterService from "../services/deadletter.service";
import UsersOnlineService from "../services/UsersOnline.service";
import MachineService from "../services/Machine.service"; // Updated import path

class BoardAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      chatHistory: [], // Store chat history
      showChatHistory: false,
      DeadLetterMessage: [], // Store dead letter messages
      showDeadLetterMessage: false,
      UsersOnline: [],
      showUsersOnline: false,
      Machine:[],
      showMachine: false

    };
  }

  componentDidMount() {
    // Load initial content
    this.loadContent();
  }

  loadContent() {
    UserService.getAdminBoard().then(
      (response) => {
        this.setState({
          content: response.data,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  // Function to retrieve chat history
  getChatHistory() {
    // Make an API request to fetch chat history
    // You should replace 'getChatHistory' with the actual endpoint URL
    ChatService.getChatHistory()
      .then((response) => {
        this.setState({
          chatHistory: response.data,
          showChatHistory: true, // Show chat history after successful retrieval
          showDeadLetterMessage: false,
          showUsersOnline: false,
          showMachine: false

        });
      })
      .catch((error) => {
        // Handle errors if needed
        console.error("Error retrieving chat history:", error);
      });
  }

  // Function to retrieve dead letter messages
  getDeadLetterMessage() {
    DeadLetterService.getDeadLetterMessage()
      .then((response) => {
        this.setState({
          DeadLetterMessage: response.data,
          showDeadLetterMessage: true, // Show dead letter messages after successful retrieval
          showChatHistory: false, // Hide chat history
          showUsersOnline: false,
          showMachine: false

        });
      })
      .catch((error) => {
        // Handle errors if needed
        console.error("Error retrieving dead letter messages:", error);
      });
  }

  handleResubmit = (messageId) => {
    // Use Axios and DeadLetterService to make the API request
    DeadLetterService.resubmitMessage(messageId)
      .then((response) => {
        if (response.status === 201) {
          // Message resubmitted successfully, you can update your state or show a success message
          // You may want to fetch the updated Dead Letter Messages list here
          this.getDeadLetterMessage();
        } else {
          // Handle error cases here, e.g., show an error message to the user
          console.error("Failed to resubmit message");
          alert("Failed to resubmit message");

        }
      })
      .catch((error) => {
        // Handle network or other errors here
        console.error("Failed to resubmit message:", error);
        alert("Failed to resubmit message(Marked as poison pill). Refresh the page.");

      });
  };

  getUsersOnline() {
    UsersOnlineService.getUsersOnline()
      .then((response) => {
        this.setState({
          UsersOnline: response.data,
          showUsersOnline: true,
          showDeadLetterMessage: false,
          showChatHistory: false,
          showMachine: false
        });
      })
      .catch((error) => {
        // Handle errors if needed
        console.error("Error retrieving users online:", error);
       alert("Error retrieving users online:");
      });
  }
  
  getMachines() {
    MachineService.getMachines()
      .then((response) => {
        this.setState({
          Machine: response.data,
          showMachine: true,
          showUsersOnline: false,
          showDeadLetterMessage: false,
          showChatHistory: false,
        });
      })
      .catch((error) => {
        // Handle errors if needed
        console.error("Error retrieving Registered machine:", error);
        alert("Error retrieving Registered machine:");

      });
  }
  handleUnregisterMachine = (machineId) => {
    // Use Axios and MachineService to make the API request to unregister the machine
    MachineService.unregisterMachine(machineId)
      .then((response) => {
        if (response.status === 200) {
          // Machine unregistered successfully, you can update your state or show a success message
          // You may want to fetch the updated list of registered machines here
          this.getMachines();
        } else {
          // Handle error cases here, e.g., show an error message to the user
          console.error("Failed to unregister machine");
        }
      })
      .catch((error) => {
        // Handle network or other errors here
        console.error("Failed to unregister machine:", error);
      });
  };

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
          <div style={{ display: "flex", flexDirection:"row", gap: "10px" }}>
          <button onClick={() => this.getChatHistory()} style={{backgroundColor:"#225c97",color:"white"}}>Chat History</button>
          <button onClick={() => this.getDeadLetterMessage()} style={{backgroundColor:"#225c97",color:"white"}}>
            Dead Letter Messages
          </button>
          <button onClick={() => this.getUsersOnline()} style={{backgroundColor:"#225c97",color:"white"}}>Users Online</button>
          <button onClick={() => this.getMachines()} style={{backgroundColor:"#225c97",color:"white"}}>Registered Machines</button>
</div>
        </header>
<div className="content-container">
<header className="jumbotron">

        {this.state.showChatHistory && (
          <div>
            <h4>Chat History:</h4>
            <ul>
              {this.state.chatHistory.map((message, index) => (
                <li key={index}>
                  <div>
                    <strong>Sender:</strong> {message.sender}
                  </div>
                  <div>
                    <strong>Receiver:</strong> {message.receiver}
                  </div>
                  <div>
                    <strong>Content:</strong> {message.content}
                  </div>
                  <div>
                    <strong>Timestamp:</strong> {message.timestamp}
                  </div>
                 
                  <div>
                    <strong>FileContent:</strong> {message.fileContent}
                  </div>
                 
                  <hr style={{border:"1px solid"}}/>
                </li>
              ))}
            </ul>
          </div>
        )}

        {this.state.showDeadLetterMessage && (
          <div>
            <h4>Dead Letter History:</h4>
            <ul>
              {this.state.DeadLetterMessage.map((message, index) => (
                <li key={index}>
                  <div>
                    <strong>Id:</strong> {message.id}
                  </div>
                  <div>
                    <strong>Sender:</strong> {message.sender}
                  </div>
                  <div>
                    <strong>Receiver:</strong> {message.receiver}
                  </div>
                  <div>
                    <strong>Content:</strong> {message.content}
                  </div>
                  <div>
                    <strong>FileContent:</strong> {message.fileContent}
                  </div>
                  <div>
                    <strong>Expiration Time:</strong> {message.timestamp}
                  </div>
                  
                 
                 <div style={{textAlign:"right"}}>
                  <button onClick={() => this.handleResubmit(message.id)} style={{backgroundColor:"#225c97",color:"white"}}>
                    Resubmit
                  </button>
                  <hr style={{border:"1px solid"}}/>               
                   </div>
           
                </li>
              ))}
            </ul>
          </div>
        )}
        {this.state.showUsersOnline && (
          <div>
            <h4>Users Online:</h4>
            <ul>
              {this.state.UsersOnline.map((user, index) => (
                <li key={index}>
                  <div>
                    <strong>Id:</strong> {user.id}
                  </div>
                  <div>
                    <strong>Name:</strong> {user.username}
                  </div>
                  <div>
                    <strong>E-Mail:</strong> {user.email}
                  </div>
                  <hr style={{border:"1px solid"}}/>
                </li>
              ))}
            </ul>
          </div>
        )}
        {this.state.showMachine && (
          <div>
            <h4>Registered Machines</h4>
            <ul>
              {this.state.Machine.map((machine, index) => (
                <li key={index}>
                  <div>
                    <strong>Id:</strong> {machine.id}
                  </div>

                  <div>
                    <strong>Name:</strong> {machine.name}
                  </div>
                  <div>
                    <strong>Ip Address:</strong> {machine.ipAddress}
                  </div>
                  <div style={{ textAlign: 'right'}}>
                  <button onClick={() => this.handleUnregisterMachine(machine.id)} style={{backgroundColor:"#225c97",color:"white"}}>
  Unregister
</button>
 <hr style={{border:"1px solid"}}/>
</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        </header>

      </div>
      </div>
    );
  }
}

export default BoardAdmin;
