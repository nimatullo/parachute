const Pair = require("../models/Pair");
const IpParser = require("../utils/ipParser");

class ConnectionManager {
  constructor() {
    this.connections = {};
  }

  onConnection(socket, request) {
    const remoteAddress = IpParser.parse(request);

    const connection = this.addToConnections(socket, remoteAddress);
    socket.on("message", (message) => this.onMessage(remoteAddress, message));

    this.send(
      { type: "new-connection", connectionInfo: connection.toJSON() },
      connection
    );

    this.startHeartbeat(connection, remoteAddress);
  }

  addToConnections(socket, remoteAddress) {
    let pair;
    if (!this.connections[remoteAddress]) {
      pair = new Pair(socket);
      this.connections[remoteAddress] = pair;
    } else {
      pair = this.connections[remoteAddress];
      pair.addConnection(socket);
    }
    return pair.lastConnection;
  }

  removeConnection(id, origin) {
    const leftOverConnection = this.connections[origin]?.removeConnection(id);

    if (!leftOverConnection) {
      delete this.connections[origin];
    } else {
      this.send({ type: "left-connection" }, leftOverConnection);
    }
  }

  onMessage(origin, message) {
    message = JSON.parse(message);
    switch (message.type) {
      case "pong":
        this.connections[origin].getById(message.from).lastPing = Date.now();
        break;
      case "disconnected":
        this.removeConnection(message.from, origin);
        break;
      case "device-info":
        this.updateDeviceInfo(message.deviceInfo, origin, message.from);
        break;
      case "download-complete":
        this.send(
          { type: "file-transfer-success", from: message.from },
          this.connections[origin].getPeer(message.from)
        );
      default:
        console.log("Unknown message type", message.type);
    }
  }

  updateDeviceInfo(deviceInfo, origin, id) {
    this.connections[origin].getById(id).device = deviceInfo;

    // If a pair has 2 connections, let them know that they are ready
    if (this.connections[origin].isReady())
      this.emitReady(this.connections[origin]);
  }

  emitReady(pair) {
    pair.connections.forEach((connection) =>
      this.send({ type: "ready", pairs: pair.toJSON() }, connection)
    );
  }

  sendFile(file, origin, id) {
    const connection = this.connections[origin].getPeer(id);

    this.send(file, connection);
  }

  send(message, connection) {
    if (!connection) {
      console.log("Connection not found");
      return;
    }

    message = JSON.stringify(message);
    connection.socket.send(message);
  }

  startHeartbeat(connection, origin) {
    this.endHeartbeat(connection);
    const timeout = 30000; // 30 seconds
    if (!connection.lastPing) connection.lastPing = Date.now();

    if (Date.now() - connection.lastPing > 2 * timeout) {
      this.removeConnection(connection.id, origin);
      return;
    }

    this.send({ type: "ping" }, connection);

    connection.timer = setTimeout(
      () => this.startHeartbeat(connection, origin),
      timeout
    );
  }

  endHeartbeat(connection) {
    if (connection.timer) clearTimeout(connection.timer);
  }
}

module.exports = ConnectionManager;
