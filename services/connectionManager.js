const Pair = require("../models/Pair");

class ConnectionManager {
  constructor() {
    this.connections = {};
  }

  addConnection(socket, request) {
    const remoteAddress = this.setIp(request);
    console.log("New incoming connection", remoteAddress);
    let id;

    socket.on("message", this.onMessage);

    if (!this.connections[remoteAddress]) {
      this.connections[remoteAddress] = new Pair(socket);
      id = this.connections[remoteAddress].firstConnection.id;
    } else {
      this.connections[remoteAddress].addSecondConnection(socket);
      id = this.connections[remoteAddress].secondConnection.id;
    }

    this.send({ type: "new-connection", id: id }, remoteAddress);

    if (this.connections[remoteAddress].isReady()) {
      this.send({ type: "ready" }, remoteAddress);
    }
  }

  removeConnection(id, request) {
    const remoteAddress = this.setIp(request);
    console.log("Removing connection", remoteAddress);
    this.connections[remoteAddress].removeConnection(id);

    if (this.connections[remoteAddress].isEmpty()) {
      delete this.connections[remoteAddress];
    }
  }

  onMessage(message) {
    console.log(`Received: ${message}`);
  }

  send(message, origin) {
    try {
      const pair = this.connections[origin];
      if (!pair) {
        console.log("No pair found or not ready: ", origin);
        return;
      }
      pair.getBoth().forEach((connection) => {
        connection.socket.send(JSON.stringify(message));
      });
    } catch (e) {
      console.log(e);
    }
  }

  setIp(req) {
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
}

module.exports = ConnectionManager;
