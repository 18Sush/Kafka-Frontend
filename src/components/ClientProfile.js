import React, { useState } from 'react';
import axios from 'axios';
import './profile.css';

function ClientProfile() {
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSelectPicture = () => {
    // Trigger the file input click event
    document.getElementById('fileInput').click();
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select an image to upload.');
      return;
    }

    if (!userId) {
      alert('Please enter a user ID.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      await axios.post(`http://localhost:9091/api/machines/${userId}/upload-profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set the profile picture to display the uploaded image
      setProfilePicture(file);

      alert('Profile picture uploaded successfully.');
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
      alert('Error uploading profile picture.');
    }
  };

  const handleDelete = async () => {
    if (!userId) {
      alert('Please enter a user ID.');
      return;
    }

    try {
      await axios.delete(`http://localhost:9091/api/machines/${userId}/delete`);
      setProfilePicture(null); // Clear the profile picture when deleted

      alert('Profile picture deleted successfully.');
    } catch (error) {
      console.error('Error deleting profile picture:', error.message);
      alert('Error deleting profile picture.');
    }
  };

  return (
    <div className="App">
      <h1>Profile</h1>
      <div className="profile-picture">
        {profilePicture && <img src={URL.createObjectURL(profilePicture)} alt="Profile" />}
      </div>
      <input
        type="file"
        id="fileInput" // Added an ID to the file input
        onChange={handleFileChange}
        accept="image/jpeg, image/png"
        style={{ display: 'none' }} // Hide the file input
      />
      <div className="input-container">
        <button className="blue-button" onClick={handleSelectPicture}>Select Picture</button>
        <br /> {/* Add a line break to place the input below the button */}
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={handleUserIdChange}
        />
      </div>
      <div className="button-container">
        <button className="blue-button" onClick={handleUpload}>Upload</button>
        <button className="blue-button" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
export default ClientProfile;