const serverIP = "ws://83.168.106.235:21000"; // Update with your WebSocket server IP
let socket;

// DOM Elements
const loginDiv = document.getElementById("login");
const dashboardDiv = document.getElementById("dashboard");
const keyInput = document.getElementById("key");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const statusIndicator = document.getElementById("status-indicator");
const consoleOutput = document.getElementById("console-output");
const commandInput = document.getElementById("command-input");
const sendCommandBtn = document.getElementById("send-command-btn");

// Event Listeners
loginBtn.addEventListener("click", authenticate);
logoutBtn.addEventListener("click", logout);
sendCommandBtn.addEventListener("click", sendCommand);

function authenticate() {
  const key = keyInput.value;
  if (key === "TestVamZaIceMC4") { // Replace with your actual key
    localStorage.setItem("key", key);
    connectWebSocket();
    showDashboard();
  } else {
    alert("Invalid Access Key!");
  }
}

function connectWebSocket() {
  socket = new WebSocket(serverIP);

  socket.onopen = () => {
    updateStatus("online");
    logConsole("Connected to the server.");
  };

  socket.onmessage = (event) => {
    if (event.data.startsWith("status:")) {
      const status = event.data.split(":")[1];
      updateStatus(status);
    } else {
      logConsole("Server: " + event.data);
    }
  };

  socket.onclose = () => {
    updateStatus("offline");
    logConsole("Disconnected from the server.");
  };

  socket.onerror = (error) => {
    updateStatus("offline");
    logConsole("Error: " + error.message);
  };
}

function sendCommand() {
  const command = commandInput.value.trim();
  if (command && socket && socket.readyState === WebSocket.OPEN) {
    socket.send(`command:${command}`);
    logConsole(`You: ${command}`);
    commandInput.value = "";
  } else {
    logConsole("Unable to send command. Check connection.");
  }
}

function logConsole(message) {
  consoleOutput.value += message + "\n";
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function updateStatus(status) {
  if (status === "online") {
    statusIndicator.className = "status-circle online";
  } else {
    statusIndicator.className = "status-circle offline";
  }
}

function logout() {
  localStorage.removeItem("key");
  socket && socket.close();
  showLogin();
}

function showDashboard() {
  loginDiv.classList.add("hidden");
  dashboardDiv.classList.remove("hidden");
}

function showLogin() {
  dashboardDiv.classList.add("hidden");
  loginDiv.classList.remove("hidden");
}

// Auto-login if key is stored
window.onload = () => {
  const savedKey = localStorage.getItem("key");
  if (savedKey === "TestVamZaIceMC4") {
    connectWebSocket();
    showDashboard();
  }
};
