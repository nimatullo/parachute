class ConnectionManager {
  constructor() {
    this.connections = {};
  }

  addConnection(socket, request) {
    console.log("New incoming connection", request.connection.remoteAddress);
    this.connections[request.connection.remoteAddress] = socket;
    socket.on("message", this.onMessage);
  }

  onMessage(message) {
    console.log(`Received: ${message}`);
  }

  send(message) {
    console.log(`Sending: ${message.fileContent}`);
    Object.values(this.connections).forEach((socket) => {
      socket.send(JSON.stringify(message));
    });
  }
}

module.exports = ConnectionManager;
