import axios from "axios";

const API_URL = "http://localhost:9091"; // Replace with your actual API URL

class ChatService {
  // Function to retrieve chat history
  getChatHistory() {
    return axios.get(`${API_URL}/chat-history`);
  }
}

export default new ChatService();
