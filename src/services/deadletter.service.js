import axios from "axios";

const API_URL = "http://localhost:9091";

class DeadLetterService {
  getDeadLetterMessage() {
    return axios.get(`${API_URL}/retrieve-all-dead-letter-messages`);
  }

  resubmitMessage(messageId) {
    // Send a POST request to resubmit the message
    return axios.post(`${API_URL}/api/resubmit/${messageId}`);
  }
}

export default new DeadLetterService();