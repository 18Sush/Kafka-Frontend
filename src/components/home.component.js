import React, { Component } from "react";

import UserService from "../services/user.service";
import logo from "../Assets/telstralogo.png";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
     
    };
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    return (
      
    <div className="container">
    <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
              }}
    >
      <img src={logo} alt="Logo"  />

    <h3 style={{fontSize:"60px",color:"#225c97",fontStyle:"oblique"}}> Welcome to TelstraTalk</h3>
    </div>
    </div>
        );
      }
    }
   