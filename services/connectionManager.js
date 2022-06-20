const Pair = require("../models/Pair");

class ConnectionManager {
  constructor() {
    this.connections = {};
  }

  onConnection(socket, request) {
    const remoteAddress = this.getIp(request);
    console.log("New incoming connection", remoteAddress);

    const connection = this.addToConnections(socket, remoteAddress);
    socket.on("message", (message) => this.onMessage(remoteAddress, message));

    this.send(
      { type: "new-connection", connectionInfo: connection.toJSON() },
      connection
    );

    this.startHeartbeat(connection, remoteAddress);

    // If a pair has 2 connections, let them know that they are ready
    if (this.connections[remoteAddress].isReady())
      this.emitReady(this.connections[remoteAddress]);
  }

  addToConnections(socket, remoteAddress) {
    if (!this.connections[remoteAddress]) {
      const pair = new Pair(socket);
      this.connections[remoteAddress] = pair;

      return pair.firstConnection;
    } else {
      const pair = this.connections[remoteAddress];
      pair.addSecondConnection(socket);

      return pair.secondConnection;
    }
  }

  removeConnection(id, origin) {
    const leftOverConnection = this.connections[origin].removeConnection(id);

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
      default:
        console.log("Unknown message type", message.type);
    }
  }

  emitReady(pair) {
    pair
      .getBoth()
      .forEach((connection) =>
        this.send({ type: "ready", pairs: pair.toJSON() }, connection)
      );
  }

  send(message, connection) {
    if (!connection) return;

    message = JSON.stringify(message);
    connection.socket.send(message);
  }

  getIp(req) {
    let ip = "";
    if (req.headers["x-forwarded-for"]) {
      ip = req.headers["x-forwarded-for"];
    } else {
      ip = req.connection.remoteAddress;
    }

    // Check if IP is localhost
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1";
    }

    // Check if IP is private
    if (this.isIpPrivate(ip)) {
      ip = "priv";
    }

    return ip;
  }

  isIpPrivate(ip) {
    // Check if ip is in IPv6 format
    if (ip.indexOf(":") !== -1) {
      // Convert ip to IPv4 format
      ip = ip.split(":").pop();
    }
    return (
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.") ||
      ip.startsWith("169.")
    );
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
