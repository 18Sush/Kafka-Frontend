// MachineService.js
import axios from "axios";

const API_URL = "http://localhost:9091"; // Replace with your actual API URL

class MachineService {
  // Function to retrieve registered machines
  getMachines() {
    return axios.get(`${API_URL}/api/machines`);
  }
  unregisterMachine(machineId) {
    return axios.delete(`${API_URL}/api/machines/${machineId}`);
  }
}

export default new MachineService();
