import axios from "axios";

const API_URL = "http://localhost:9091"; // Replace with your actual API URL

class UsersOnlineService {
  // Function to retrieve chat history
  getUsersOnline() {
    return axios.get(`${API_URL}/api/machines/online`);
  }
}


export default new UsersOnlineService();

