import axios from "axios";

const API_URL = "http://localhost:8082"; // Replace with your actual API URL

class UsersOnlineService {
  // Function to retrieve chat history
  getUsersOnline() {
    return axios.get(`${API_URL}/api/auth/online-users`);
  }
}


export default new UsersOnlineService();

