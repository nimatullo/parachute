const Connection = require("./Connection");

module.exports = class Pair {
  constructor(socket) {
    this.firstConnection = new Connection(socket);
    this.secondConnection = null;
  }

  addSecondConnection(socket) {
    this.secondConnection = new Connection(socket);
  }

  isReady() {
    return this.firstConnection && this.secondConnection;
  }

  removeConnection(id) {
    if (this.firstConnection.id === id) {
      this.firstConnection = null;
    } else if (this.secondConnection.id === id) {
      this.secondConnection = null;
    }
  }

  isEmpty() {
    return this.firstConnection === null && this.secondConnection === null;
  }

  getBoth() {
    return [this.firstConnection, this.secondConnection];
  }
};
