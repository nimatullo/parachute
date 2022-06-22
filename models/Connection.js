const { v4: uuid } = require("uuid");
const generateName = require("../utils/generator");
const WebSocket = require("ws");

module.exports = class Connection {
  constructor(socket) {
    this.id = uuid();
    this.name = generateName();
    this.socket = socket;
    this.lastPing = Date.now();
    this.timer = 0;
    this.device = null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      device: this.device,
    };
  }

  isReady() {
    return this.socket.readyState === WebSocket.OPEN;
  }
};
