import React, { Component } from 'react';
import axios from 'axios';
import AuthService from '../services/auth.service';
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button from a UI library or component library of your choice

class MachineRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      machineName: '',
      ipAddress: '',
      isEditingName: false,
      isEditingIP: false,
      showModal: false, // Add this state variable
    };

    // Define the backend API URL for registering machines here
    this.apiUrl = 'http://localhost:9091/api/machines';

    // Binding event handlers
    this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidMount() {
    // Automatically detect and set the machine name and IP address
    this.detectMachineInfo();

    // Check if the user is logged in
    const user = AuthService.getCurrentUser();
    if (!user) {
      this.setState({ showModal: true }); // Show the registration modal if the user is not logged in
    }
  }

  // Function to open the registration modal
  openModal = () => {
    this.setState({ showModal: true });
  };

  // Function to close the registration modal
  closeModal = () => {
    this.setState({ showModal: false });
  };

  detectMachineInfo() {
    // Use JavaScript to detect machine info
    const hostname = window.location.hostname;
    const ipAddress = window.location.host;

    this.setState({
      machineName: hostname,
      ipAddress: ipAddress,
    });
  }

  handleRegister() {
    const { machineName, ipAddress } = this.state;
    const user = AuthService.getCurrentUser();

    if (!user) {
      // Show the registration modal if the user is not logged in
      this.openModal();
      return;
    }

    if (machineName && ipAddress) {
      const machineData = {
        name: machineName,
        ipAddress: ipAddress,
      };

      axios
        .post(this.apiUrl, machineData)
        .then((response) => {
          console.log('Machine registered successfully:', response.data);
          alert('Machine registered successfully:');
          // Clear the input fields after successful registration
          this.setState({ machineName: '', ipAddress: '' });

          // After registration, update the machine status to online
          this.updateMachineStatus(response.data.id, true); // Assuming the response contains the machine ID
        })
        .catch((error) => {
          console.error('Error registering machine:', error);
          alert('Error registering machine:');
        });
    } else {
      alert('Both Machine Name and IP Address are required.');
    }
  }

  toggleEditName = () => {
    this.setState((prevState) => ({
      isEditingName: !prevState.isEditingName,
    }));
  };

  toggleEditIP = () => {
    this.setState((prevState) => ({
      isEditingIP: !prevState.isEditingIP,
    }));
  };

  updateMachineStatus(machineId, online) {
    // Send a request to update the machine status
    axios
      .post(`${this.apiUrl}/${machineId}/status?online=${online}`)
      .then((response) => {
        console.log('Machine status updated successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error updating machine status:', error);
      });
  }

  render() {
    const { machineName, ipAddress, isEditingName, isEditingIP, showModal } = this.state;

    return (
      <div className="col-md-4 mx-auto">
        <div className="card">
          <div className="card-body">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
            <h4 className="card-title">Machine Registration</h4>
            <form>
  <div className="mb-3">
    <label htmlFor="machineName" className="form-label">
      Machine Name:
    </label>
    <input
      type="text"
      className={`form-control ${isEditingName ? '' : 'form-control-plaintext'}`}
      id="machineName"
      name="machineName"
      value={machineName}
      onChange={(e) => this.setState({ machineName: e.target.value })}
      disabled={!isEditingName} 
    />
    <button type="button" className="btn btn-link" onClick={this.toggleEditName}>
      {isEditingName ? 'Save' : 'Edit'}
    </button>
  </div>
  <div className="mb-3">
    <label htmlFor="ipAddress" className="form-label">
      IP Address:
    </label>
    <input
      type="text"
      className={`form-control ${isEditingIP ? '' : 'form-control-plaintext'}`}
      id="ipAddress"
      name="ipAddress"
      value={ipAddress}
      onChange={(e) => this.setState({ ipAddress: e.target.value })}
      disabled={!isEditingIP} // Disable the input when not in edit mode
    />
    <button type="button" className="btn btn-link" onClick={this.toggleEditIP}>
      {isEditingIP ? 'Save' : 'Edit'}
    </button>
  </div>
  <button
    type="button"
    className="btn btn-primary btn-block"
    onClick={this.handleRegister}
    style={{ backgroundColor: '#225c97' }}
  >
    Register Machine
  </button>
</form>

          </div>
        </div>

        {/* Registration Modal */}
        <Modal show={showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Registration Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            To register a machine, please log in or sign up.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal} style={{ backgroundColor: 'red' }}>
              Close

            </Button>
            <Button variant="primary"  style={{ backgroundColor: '#225c97'}}>
              <a href="/login" style={{color:'white'}}>Login</a>
            
            </Button>
            <Button variant="primary"  style={{ backgroundColor: '#225c97', color:'white' }}>
            <a href="/register" style={{color:'white'}}>SignUp</a>

            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default MachineRegistration;
