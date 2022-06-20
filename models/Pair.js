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
    if (this.firstConnection?.id === id) {
      this.firstConnection = null;
      return this.secondConnection;
    } else if (this.secondConnection?.id === id) {
      this.secondConnection = null;
      return this.firstConnection;
    }
  }

  isEmpty() {
    return this.firstConnection === null && this.secondConnection === null;
  }

  getBoth() {
    return [this.firstConnection, this.secondConnection];
  }

  getById(id) {
    if (this.firstConnection?.id === id) {
      return this.firstConnection;
    } else if (this.secondConnection?.id === id) {
      return this.secondConnection;
    }
  }

  toJSON() {
    return [this.firstConnection.toJSON(), this.secondConnection.toJSON()];
  }
};
