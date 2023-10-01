import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./components/myStyles.css"

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";
import MachineRegistration from "./components/MachineRegistration";
import ClientProfile from "./components/ClientProfile";

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import MainContainer from "./components/MainContainer";

class App extends Component {

  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
       
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
      
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard, } = this.state;

    return (
      
      <div>
        <nav className="navbar navbar-expand" style={{backgroundColor:"#225c97"}}>
          <Link to={"/"} className="navbar-brand" style={{ color: "white" }}>
          TelstraTalk
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link" style={{ color: "white"}}>
                Home
              </Link>
            </li>

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link" style={{ color: "white" }}>
                
                  Admin Board
                </Link>
              </li>
            )}

            {currentUser && !showAdminBoard && (
  <li className="nav-item">
    <Link to={"/chatarea"} className="nav-link" style={{ color: "white" }}>
      Chat
    </Link>
  </li>
)}
<li className="nav-item">
              <a href="/machineregistration" className="nav-link" style={{ color: "white" }}>
             Machine Registration
              </a>
            </li>
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
            <Link to="/ClientProfile">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
          style={{ height: "40px", width: "40px" }}
        />
      </Link>
              <li className="nav-item">
              
                <Link to={"/profile"} className="nav-link" style={{ color: "white" }}>
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut} style={{ color: "white" }}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link" style={{ color: "white" }}>
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link" style={{ color: "white" }}>
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
        
         <Routes>
        <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/mod" element={<BoardModerator />} />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/machineregistration" element={<MachineRegistration />} />
         <Route path="/chatarea" element={<MainContainer />} />
         
        <Route path="/ClientProfile" element={<ClientProfile />} />

          </Routes> 
        </div>

        {/* <AuthVerify logOut={this.logOut}/> */}
      </div>
    );
  }
}

export default App;
