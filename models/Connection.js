const { v4: uuid } = require("uuid");

module.exports = class Connection {
  constructor(socket) {
    this.id = uuid();
    this.socket = socket;
  }
};
