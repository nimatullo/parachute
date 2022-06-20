const { v4: uuid } = require("uuid");
const generateName = require("../services/generator");

module.exports = class Connection {
  constructor(socket) {
    this.id = uuid();
    this.name = generateName();
    this.socket = socket;
    this.lastPing = Date.now();
    this.timer = 0;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }
};
